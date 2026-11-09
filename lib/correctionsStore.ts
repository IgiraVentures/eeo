import "server-only";
import { join } from "path";

import type { CorrectionActivity, CorrectionSubmission, CorrectionTriagePatch } from "@/lib/correctionsSchema";
import { atomicWriteJsonSync, getEeoDataDir, readJsonFileSync } from "@/lib/eeoJsonPersistence";

export type {
  CorrectionActivity,
  CorrectionActivityType,
  CorrectionCategory,
  CorrectionGovernanceOutcome,
  CorrectionSubmission,
  CorrectionTriagePatch,
  CorrectionTriageStatus,
} from "@/lib/correctionsSchema";
export { CORRECTION_CATEGORIES, isCorrectionCategory } from "@/lib/correctionsSchema";

const CORRECTIONS_SCHEMA_VERSION = 1 as const;

/** JSON-file persistence is local/single-node only, never durable on Vercel. */
export function isCorrectionsPersistenceAvailable(): boolean {
  return process.env.VERCEL !== "1" && process.env.DISABLE_EEO_FILE_PERSISTENCE !== "true";
}

/** Working set mirrored to disk for single-node deploys (see `.eeo/`). */
const correctionsStore: CorrectionSubmission[] = [];

let correctionsLoaded = false;

function getCorrectionsStorePath(): string {
  const env = process.env.CORRECTIONS_STORE_PATH?.trim();
  if (env) return env;
  return join(getEeoDataDir(), "corrections.json");
}

function correctionsPersistenceEnabled(): boolean {
  if (process.env.VITEST === "true") return false;
  return isCorrectionsPersistenceAvailable();
}

function normalizeSubmission(s: CorrectionSubmission): CorrectionSubmission {
  return {
    ...s,
    activities: Array.isArray(s.activities) ? s.activities : [],
  };
}

function cloneSubmission(submission: CorrectionSubmission): CorrectionSubmission {
  const activities = submission.activities ?? [];
  return {
    ...submission,
    activities: activities.map((activity) => ({ ...activity })),
  };
}

function parsePersistedCorrections(data: unknown): CorrectionSubmission[] | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  if (o.schemaVersion !== CORRECTIONS_SCHEMA_VERSION) return null;
  if (!Array.isArray(o.submissions)) return null;
  return o.submissions as CorrectionSubmission[];
}

function ensureCorrectionsLoadedSync(): void {
  if (correctionsLoaded) return;
  correctionsLoaded = true;
  if (!correctionsPersistenceEnabled()) return;

  const path = getCorrectionsStorePath();
  try {
    const raw = readJsonFileSync<unknown>(path);
    if (!raw) return;
    const parsed = parsePersistedCorrections(raw);
    if (!parsed) {
      console.error("[eeo] Invalid corrections store JSON; ignoring file:", path);
      return;
    }
    correctionsStore.push(...parsed.map(normalizeSubmission));
  } catch (e) {
    console.error("[eeo] Failed to load corrections store:", e);
  }
}

function persistCorrectionsSync(): void {
  if (process.env.VITEST === "true") return;
  if (!isCorrectionsPersistenceAvailable()) {
    throw new Error("Durable corrections storage is not configured.");
  }
  try {
    atomicWriteJsonSync(getCorrectionsStorePath(), {
      schemaVersion: CORRECTIONS_SCHEMA_VERSION,
      submissions: correctionsStore.map((s) => cloneSubmission(s)),
    });
  } catch (e) {
    console.error("[eeo] Failed to persist corrections store:", e);
    throw new Error("Corrections could not be persisted.");
  }
}

/** Clears the in-memory store. Vitest only — prevents cross-test leakage. */
export function resetCorrectionsStoreForTests(): void {
  if (process.env.VITEST !== "true") {
    throw new Error("resetCorrectionsStoreForTests is only available under Vitest.");
  }
  correctionsStore.length = 0;
  correctionsLoaded = true;
}

export function addCorrectionSubmission(submission: CorrectionSubmission) {
  if (!isCorrectionsPersistenceAvailable()) {
    throw new Error("Durable corrections storage is not configured.");
  }
  ensureCorrectionsLoadedSync();
  correctionsStore.push(submission);
  try {
    persistCorrectionsSync();
  } catch (error) {
    const index = correctionsStore.indexOf(submission);
    if (index !== -1) correctionsStore.splice(index, 1);
    throw error;
  }
}

export function listCorrectionSubmissions(): CorrectionSubmission[] {
  ensureCorrectionsLoadedSync();
  return correctionsStore
    .map(cloneSubmission)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function getCorrectionSubmissionById(id: string): CorrectionSubmission | undefined {
  ensureCorrectionsLoadedSync();
  const match = correctionsStore.find((s) => s.id === id);
  return match ? cloneSubmission(match) : undefined;
}

function activityId(): string {
  return `ACT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/** Single append-only entry point for activity log records. */
function appendActivity(entry: CorrectionSubmission, activity: Omit<CorrectionActivity, "id" | "correctionId">) {
  entry.activities = entry.activities ?? [];
  entry.activities.push({
    id: activityId(),
    correctionId: entry.id,
    ...activity,
  });
}

/**
 * Applies a partial triage patch. Updates `triageUpdatedAt` when anything changes.
 * Returns false if submission id does not exist.
 */
export function patchCorrectionSubmission(id: string, patch: CorrectionTriagePatch): boolean {
  ensureCorrectionsLoadedSync();
  const entry = correctionsStore.find((s) => s.id === id);
  if (!entry) return false;

  let touched = false;
  const now = new Date().toISOString();

  if (
    patch.triageStatus !== undefined &&
    patch.triageStatus !== entry.triageStatus
  ) {
    const fromStatus = entry.triageStatus;
    entry.triageStatus = patch.triageStatus;
    appendActivity(entry, {
      type: "triage_status_changed",
      fromStatus,
      toStatus: patch.triageStatus,
      actor: "reviewer",
      reviewerId: patch.reviewerId,
      reviewerLabel: patch.reviewerLabel,
      createdAt: now,
    });
    touched = true;
  }

  if (patch.triageNote !== undefined) {
    const normalized =
      patch.triageNote === null || patch.triageNote.trim() === ""
        ? undefined
        : patch.triageNote.trim();
    const prev = entry.triageNote ?? "";
    const next = normalized ?? "";
    if (prev !== next) {
      entry.triageNote = normalized;
      appendActivity(entry, {
        type: prev ? "triage_note_updated" : "triage_note_added",
        note: normalized,
        actor: "reviewer",
        reviewerId: patch.reviewerId,
        reviewerLabel: patch.reviewerLabel,
        createdAt: now,
      });
      touched = true;
    }
  }

  if (patch.triageGovernanceOutcome !== undefined) {
    const normalized = patch.triageGovernanceOutcome ?? undefined;
    if (entry.triageGovernanceOutcome !== normalized) {
      entry.triageGovernanceOutcome = normalized;
      appendActivity(entry, {
        type: "governance_outcome_changed",
        note: normalized,
        actor: "reviewer",
        reviewerId: patch.reviewerId,
        reviewerLabel: patch.reviewerLabel,
        createdAt: now,
      });
      touched = true;
    }
  }

  if (touched) {
    entry.triageUpdatedAt = now;
  }

  if (touched) {
    persistCorrectionsSync();
  }

  return true;
}
