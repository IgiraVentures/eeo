import { copperCobaltCorridorPilotSkeleton } from "@/data/corridorDossier";
import { copperCobaltProvisionalCharter } from "@/data/corridorCharters";
import { copperCobaltLayerAssessments } from "@/data/crossCuttingLayerAssessments";
import { claims } from "@/data/claims";
import { evidenceItems } from "@/data/evidence";
import { releaseManifest } from "@/data/releaseManifest";
import { copperCobaltPilotSourceMap } from "@/data/sourceMap";
import { sources } from "@/data/sources";
import { getClaimCorrectionSummary, getClaimEvidenceCompleteness } from "@/lib/claimUtils";
import { listCorrectionSubmissions } from "@/lib/correctionsStore";
import { assessEvidenceOperatingSystem } from "@/lib/evidenceOperatingSystem";
import { getDefaultPublicRecordStatus } from "@/lib/recordDisclosure";
import { assessReleaseManifestReadiness } from "@/lib/releaseManifestReadiness";

import { PublicRecordStatusBadge, RecordModeBadge } from "./StatusBadges";

function formatToken(value: string): string {
  return value.replaceAll("_", " ");
}

function statusClass(status: "pass" | "warning" | "blocked"): string {
  if (status === "pass") {
    return "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950";
  }

  if (status === "warning") {
    return "rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950";
  }

  return "rounded-2xl border border-red-200 bg-red-50 p-4 text-red-950";
}

export default function ReleaseManifestPanel() {
  const corrections = listCorrectionSubmissions();
  const summaries = claims.map((claim) => getClaimCorrectionSummary(claim.id, corrections));

  const challengedClaimIds = summaries
    .filter((summary) => summary.governanceStatus === "challenged" || summary.governanceStatus === "under_review")
    .map((summary) => summary.claimId);
  const correctedClaimIds = summaries
    .filter((summary) => summary.governanceStatus === "corrected")
    .map((summary) => summary.claimId);
  const restrictedClaimIds = summaries
    .filter((summary) => summary.governanceStatus === "restricted")
    .map((summary) => summary.claimId);
  const withdrawnClaimIds = summaries
    .filter((summary) => summary.governanceStatus === "withdrawn")
    .map((summary) => summary.claimId);

  const openCorrectionIds = corrections
    .filter((correction) => correction.triageStatus !== "resolved")
    .map((correction) => correction.id);

  const linkedCorrectionCount = corrections.filter((correction) => Boolean(correction.claimId)).length;
  const governanceSignalCount =
    challengedClaimIds.length + correctedClaimIds.length + restrictedClaimIds.length + withdrawnClaimIds.length;

  const lastCorrectionReviewAt = corrections
    .map((correction) => correction.triageUpdatedAt || correction.submittedAt)
    .sort((a, b) => b.localeCompare(a))[0];

  const rightOfReplySummary = claims.map((claim) => `${claim.id}: ${claim.rightOfReplyStatus}`).join("; ");
  const completenessRows = claims.map((claim) =>
    getClaimEvidenceCompleteness(claim, evidenceItems, sources, copperCobaltPilotSourceMap)
  );
  const completeClaimCount = completenessRows.filter((row) => row.isComplete).length;

  const evidenceCompletenessSummary =
    releaseManifest.evidenceCompletenessSummary ??
    `${completeClaimCount}/${claims.length} claims are evidence-complete for this release.`;

  const evidenceOperatingAssessment = assessEvidenceOperatingSystem({
    claims,
    evidenceItems,
    sources,
  });

  const releaseReadinessAssessment = assessReleaseManifestReadiness({
    dossier: copperCobaltCorridorPilotSkeleton,
    claims,
    evidenceItems,
    sources,
    corridorCharter: copperCobaltProvisionalCharter,
    corridorLayerAssessments: copperCobaltLayerAssessments,
  });

  const structuralBlockerCount = releaseReadinessAssessment.blockingStructuralIssues.length;
  const reviewFlagCount = releaseReadinessAssessment.reviewFlags.length;
  const evidenceOperatingBlockerCount = evidenceOperatingAssessment.blockers.length;
  const evidenceOperatingWarningCount = evidenceOperatingAssessment.warnings.length;

  const releaseStatus =
    structuralBlockerCount > 0 || evidenceOperatingBlockerCount > 0
      ? "blocked"
      : reviewFlagCount > 0 || evidenceOperatingWarningCount > 0
        ? "warning"
        : "pass";

  return (
    <section className="space-y-6 rounded-3xl border border-stone-200 bg-white/80 p-6 shadow-sm">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
          Release record
        </p>
        <h2 className="text-2xl font-semibold text-stone-950">Release manifest</h2>
        <div className="flex flex-wrap gap-2">
          <RecordModeBadge value={releaseManifest.recordMode} />
          <PublicRecordStatusBadge value={getDefaultPublicRecordStatus(releaseManifest.recordMode)} />
        </div>
        <p className="max-w-3xl text-sm leading-6 text-stone-700">
          This surface records release posture, known limits, evidence-operating checks, structural readiness,
          correction posture, and right-of-reply posture. It does not sign a release, approve publication,
          assign liability, certify traceability, or make legal findings.
        </p>
      </div>

      <div className={statusClass(releaseStatus)}>
        <p className="text-sm font-semibold">
          Public status: {formatToken(getDefaultPublicRecordStatus(releaseManifest.recordMode))}
        </p>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-4">
          <p><strong>Structural blockers:</strong> {structuralBlockerCount}</p>
          <p><strong>Review flags:</strong> {reviewFlagCount}</p>
          <p><strong>Evidence blockers:</strong> {evidenceOperatingBlockerCount}</p>
          <p><strong>Evidence warnings:</strong> {evidenceOperatingWarningCount}</p>
        </div>
        <p className="mt-3 rounded-2xl border border-white/70 bg-white/65 p-3 text-xs leading-5">
          {releaseReadinessAssessment.publicSafeSummary}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-stone-200 bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Claims</p>
          <p className="mt-2 text-2xl font-semibold text-stone-950">{releaseReadinessAssessment.totalClaims}</p>
          <p className="mt-1 text-xs text-stone-600">
            {releaseReadinessAssessment.approvableClaims} meet structural checks;{" "}
            {releaseReadinessAssessment.nonApprovableClaims} remain under review.
          </p>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Evidence completeness</p>
          <p className="mt-2 text-2xl font-semibold text-stone-950">
            {completeClaimCount}/{claims.length}
          </p>
          <p className="mt-1 text-xs text-stone-600">Claims with complete source/evidence posture.</p>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Correction posture</p>
          <p className="mt-2 text-2xl font-semibold text-stone-950">{openCorrectionIds.length}</p>
          <p className="mt-1 text-xs text-stone-600">Open correction items currently affecting release review.</p>
        </article>
      </div>

      {releaseReadinessAssessment.blockingStructuralIssues.length > 0 ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-950">
          <p className="font-semibold">Structural release blockers</p>
          <ul className="mt-3 space-y-2 text-xs">
            {releaseReadinessAssessment.blockingStructuralIssues.map((item) => (
              <li key={item.type}>
                <strong>{formatToken(item.type)}:</strong> {item.count} — {item.publicSafeSummary}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {releaseReadinessAssessment.reviewFlags.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Review flags</p>
          <ul className="mt-3 space-y-2 text-xs">
            {releaseReadinessAssessment.reviewFlags.map((item) => (
              <li key={item.type}>
                <strong>{formatToken(item.type)}:</strong> {item.count} — {item.publicSafeSummary}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {evidenceOperatingAssessment.blockers.length > 0 ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-950">
          <p className="font-semibold">Evidence-operating blockers</p>
          <ul className="mt-3 space-y-2 text-xs">
            {evidenceOperatingAssessment.blockers.slice(0, 8).map((finding) => (
              <li key={`${finding.recordType}-${finding.recordId}-${finding.issue}`}>
                <strong>{finding.recordId}:</strong> {finding.issue} Remedy: {finding.remedy}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {evidenceOperatingAssessment.warnings.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Evidence-operating warnings</p>
          <ul className="mt-3 space-y-2 text-xs">
            {evidenceOperatingAssessment.warnings.slice(0, 8).map((finding) => (
              <li key={`${finding.recordType}-${finding.recordId}-${finding.issue}`}>
                <strong>{finding.recordId}:</strong> {finding.issue} Remedy: {finding.remedy}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-2 text-sm text-stone-700 md:grid-cols-2">
        <p><strong>Corridor:</strong> {releaseManifest.corridor}</p>
        <p><strong>Methodology version:</strong> {releaseManifest.methodologyVersion}</p>
        <p><strong>Claims included:</strong> {releaseManifest.includedClaimIds.join(", ") || "None"}</p>
        <p><strong>Claims withheld:</strong> {releaseManifest.withheldClaimIds.join(", ") || "None"}</p>
        <p><strong>Claims challenged:</strong> {challengedClaimIds.join(", ") || "None"}</p>
        <p><strong>Claims corrected:</strong> {correctedClaimIds.join(", ") || "None"}</p>
        <p><strong>Claims restricted:</strong> {restrictedClaimIds.join(", ") || "None"}</p>
        <p><strong>Claims withdrawn:</strong> {withdrawnClaimIds.join(", ") || "None"}</p>
        <p><strong>Open correction items:</strong> {openCorrectionIds.join(", ") || "None"}</p>
        <p>
          <strong>Last correction review date:</strong>{" "}
          {lastCorrectionReviewAt ? new Date(lastCorrectionReviewAt).toLocaleString() : "No correction activity yet"}
        </p>
        <p><strong>Unresolved disputes:</strong> {releaseManifest.unresolvedDisputes.join(", ") || "None"}</p>
        <p><strong>Release date:</strong> {releaseManifest.releaseDate ?? "Not published"}</p>
        <p className="md:col-span-2"><strong>Exposure review result:</strong> {releaseManifest.exposureReviewSummary}</p>
        <p className="md:col-span-2"><strong>Right-of-reply status:</strong> {rightOfReplySummary}</p>
        <p className="md:col-span-2">
          <strong>Right-of-reply applicability:</strong>{" "}
          {releaseManifest.rightOfReplySummary ??
            "Right-of-reply applies where claims may materially affect identifiable institutions; this is not legal adjudication."}
        </p>
        <p className="md:col-span-2">
          <strong>Evidence completeness:</strong> {evidenceCompletenessSummary}
        </p>
        <p className="md:col-span-2">
          <strong>Source limitations summary:</strong>{" "}
          {(releaseManifest.sourceLimitationsSummary ?? []).join(" ") || "None recorded."}
        </p>
        <p className="md:col-span-2">
          <strong>Map-safety restrictions:</strong>{" "}
          {(releaseManifest.mapSafetyRestrictions ?? []).join(" ") || "No explicit map restrictions noted."}
        </p>
        <p className="md:col-span-2"><strong>Known limitations:</strong> {releaseManifest.publicLimitations.join(" ")}</p>
        <p className="md:col-span-2">
          <strong>Correction/governance summary:</strong> {corrections.length} total correction submissions,{" "}
          {linkedCorrectionCount} linked to known claims, {openCorrectionIds.length} currently open, and{" "}
          {governanceSignalCount} claim governance signals recorded across challenged, corrected, restricted, and
          withdrawn states.
        </p>
        <p><strong>Approvals:</strong> {releaseManifest.approvedBy.join(", ")}</p>
        <p><strong>Correction route:</strong> /corrections</p>
      </div>
    </section>
  );
}
