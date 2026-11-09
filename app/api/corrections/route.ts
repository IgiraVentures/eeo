import { NextResponse } from "next/server";
import {
  addCorrectionSubmission,
  isCorrectionCategory,
  isCorrectionsPersistenceAvailable,
  type CorrectionSubmission,
} from "@/lib/correctionsStore";
import { claims } from "@/data/claims";

const MAX_NAME = 300;
const MAX_EMAIL = 320;
const MAX_DETAILS = 20_000;
const MAX_CLAIM_ID = 128;
const MAX_CLAIM_REFERENCE = 300;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function unavailableResponse() {
  return NextResponse.json(
    { error: "Correction submissions are temporarily unavailable. Please try again later." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  // Refuse intake before accepting PII on a runtime without a durable store.
  if (!isCorrectionsPersistenceAvailable()) return unavailableResponse();
  let body: Partial<CorrectionSubmission>;
  try {
    body = (await request.json()) as Partial<CorrectionSubmission>;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const emailRaw = body.email?.trim() ?? "";
  const details = body.details?.trim() ?? "";
  const category = body.category;
  const email = emailRaw.slice(0, MAX_EMAIL);

  if (!name || !email || !details || !isCorrectionCategory(category)) {
    return NextResponse.json(
      { error: "name, a valid email, a known category, and details are required." },
      { status: 400 }
    );
  }

  if (name.length > MAX_NAME || details.length > MAX_DETAILS) {
    return NextResponse.json({ error: "Name or details exceed allowed length." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid contact email is required." }, { status: 400 });
  }

  const claimIdRaw = body.claimId?.trim();
  if (claimIdRaw && claimIdRaw.length > MAX_CLAIM_ID) {
    return NextResponse.json({ error: "claimId is too long." }, { status: 400 });
  }
  const claimReferenceRaw = body.claimReference?.trim();
  if (claimReferenceRaw && claimReferenceRaw.length > MAX_CLAIM_REFERENCE) {
    return NextResponse.json({ error: "claimReference is too long." }, { status: 400 });
  }
  const autoLinkedClaimId =
    !claimIdRaw && claimReferenceRaw
      ? (claims.find((claim) => claim.id === claimReferenceRaw)?.id ?? undefined)
      : undefined;

  const submittedAt = new Date().toISOString();
  const submissionId = `CORR-${Date.now().toString(36).toUpperCase()}`;
  const activityId = `ACT-${Date.now().toString(36).toUpperCase()}-SUB`;

  const submission: CorrectionSubmission = {
    id: submissionId,
    submittedAt,
    name,
    email,
    category,
    claimId: claimIdRaw || autoLinkedClaimId || undefined,
    claimReference: claimReferenceRaw || undefined,
    details,
    triageStatus: "queued",
    triageUpdatedAt: submittedAt,
    activities: [
      {
        id: activityId,
        correctionId: submissionId,
        type: "submitted",
        actor: "public_submitter",
        createdAt: submittedAt,
      },
    ],
  };

  try {
    addCorrectionSubmission(submission);
  } catch {
    return unavailableResponse();
  }

  return NextResponse.json({
    id: submission.id,
    submittedAt: submission.submittedAt,
    message: "Correction request received for triage.",
  });
}
