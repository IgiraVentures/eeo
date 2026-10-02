import { claimReviewRequirements } from "@/data/claimReviewRequirements";
import { claims } from "@/data/claims";
import { evidenceItems } from "@/data/evidence";
import { releaseManifest } from "@/data/releaseManifest";
import { reviewSignoffs } from "@/data/reviewSignoffs";
import { copperCobaltPilotSourceMap } from "@/data/sourceMap";
import { sources } from "@/data/sources";
import { listCorrectionSubmissions } from "@/lib/correctionsStore";
import { assessDossierClaimReadiness } from "@/lib/dossierClaimReadiness";
import { assessReleaseManifestSignoffGate } from "@/lib/releaseManifestSignoffGate";
import { makeClaimReviewObjectVersion } from "@/lib/reviewObjectVersion";
import {
  assessReviewSignoffReadiness,
  type ReviewRequirementState,
} from "@/lib/reviewSignoffReadiness";

function statusClass(status: "ready" | "needs_review" | "blocked"): string {
  if (status === "ready") {
    return "border-emerald-200 bg-emerald-50 text-emerald-950";
  }

  if (status === "needs_review") {
    return "border-amber-200 bg-amber-50 text-amber-950";
  }

  return "border-red-200 bg-red-50 text-red-950";
}

function requirementStateClass(state: ReviewRequirementState): string {
  if (state === "satisfied") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  if (state === "pending") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }
  return "border-red-200 bg-red-50 text-red-900";
}

function formatToken(value: string): string {
  return value.replaceAll("_", " ");
}

/**
 * Protected reviewer workspace panel. Do not import into public routes.
 * Only public-safe signoff summaries and aggregate state are rendered here.
 * This diagnostic surface cannot create, approve, or persist review decisions.
 */
export default function DossierReadinessPanel() {
  const corrections = listCorrectionSubmissions();
  const assessment = assessDossierClaimReadiness({
    claims,
    evidenceItems,
    sources,
    sourceMap: copperCobaltPilotSourceMap,
    releaseManifest,
    corrections,
  });
  const manifestSignoffGate = assessReleaseManifestSignoffGate({
    releaseManifest,
    requirements: claimReviewRequirements,
    signoffs: reviewSignoffs,
    currentObjectVersions: claims.map(makeClaimReviewObjectVersion),
  });
  const claimIdsWithRequirements = [
    ...new Set(claimReviewRequirements.map((requirement) => requirement.objectId)),
  ];
  const claimSignoffAssessments = claimIdsWithRequirements.map((claimId) => ({
    claimId,
    title: claims.find((claim) => claim.id === claimId)?.title ?? "Claim not found",
    assessment: assessReviewSignoffReadiness({
      objectId: claimId,
      requirements: claimReviewRequirements,
      signoffs: reviewSignoffs,
    }),
  }));

  const hasBlockers =
    assessment.blockedClaimCount > 0 || !manifestSignoffGate.passes;
  const hasReviewItems = assessment.needsReviewClaimCount > 0;

  return (
    <section
      className={
        hasBlockers
          ? "rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-950"
          : hasReviewItems
            ? "rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"
            : "rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950"
      }
    >
      <p className="font-semibold">
        Dossier claim-readiness pass:{" "}
        {hasBlockers ? "Blocked" : hasReviewItems ? "Review required" : "Pass"}
      </p>
      <p className="mt-2 text-xs leading-5">{assessment.publicSafeSummary}</p>

      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-4">
        <p>
          <strong>Total claims:</strong> {assessment.totalClaims}
        </p>
        <p>
          <strong>Ready:</strong> {assessment.readyClaimCount}
        </p>
        <p>
          <strong>Needs review:</strong> {assessment.needsReviewClaimCount}
        </p>
        <p>
          <strong>Blocked:</strong> {assessment.blockedClaimCount}
        </p>
      </div>

      <div
        className={`mt-5 rounded-2xl border p-4 ${
          manifestSignoffGate.passes
            ? "border-emerald-200 bg-white/75 text-emerald-950"
            : "border-red-200 bg-white/75 text-red-950"
        }`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              Governed manifest signoff gate
            </p>
            <p className="mt-1 font-semibold">
              {manifestSignoffGate.passes ? "Structural pass" : "Blocked"}
            </p>
          </div>
          <p className="rounded-full border border-current/30 px-3 py-1 text-xs font-medium">
            Manifest {manifestSignoffGate.manifestId}
          </p>
        </div>
        <p className="mt-2 text-xs leading-5">
          {manifestSignoffGate.publicSafeSummary}
        </p>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3 xl:grid-cols-6">
          <p>
            <strong>Included claims:</strong>{" "}
            {manifestSignoffGate.includedClaimCount}
          </p>
          <p>
            <strong>Missing requirements:</strong>{" "}
            {manifestSignoffGate.claimsMissingRequirements.length}
          </p>
          <p>
            <strong>Missing versions:</strong>{" "}
            {manifestSignoffGate.claimsMissingObjectVersions.length}
          </p>
          <p>
            <strong>Pending:</strong>{" "}
            {manifestSignoffGate.claimsPendingReview.length}
          </p>
          <p>
            <strong>Blocked:</strong>{" "}
            {manifestSignoffGate.claimsBlockedByReview.length}
          </p>
          <p>
            <strong>Expired:</strong>{" "}
            {manifestSignoffGate.claimsWithExpiredReview.length}
          </p>
        </div>
        <p className="mt-3 text-[11px] leading-5 opacity-80">
          Rehearsal examples do not satisfy this gate. A structural pass does not
          sign, publish, certify, or adjudicate the manifest.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em]">
            Accountable claim review lanes
          </p>
          <p className="mt-1 text-xs leading-5 opacity-80">
            Requirement state is derived only from the governed signoff dataset.
            Internal rationale, reviewer identity, and private notes are not shown.
          </p>
        </div>
        {claimSignoffAssessments.map(({ claimId, title, assessment: signoffAssessment }) => (
          <article
            key={claimId}
            className={`rounded-2xl border bg-white/75 p-4 ${
              signoffAssessment.releaseEligible
                ? "border-emerald-200"
                : "border-amber-200"
            }`}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                  {claimId}
                </p>
                <h3 className="mt-1 font-semibold">{title}</h3>
              </div>
              <p className="rounded-full border border-current/30 px-3 py-1 text-xs font-medium">
                {signoffAssessment.releaseEligible ? "Eligible" : "Not eligible"}
              </p>
            </div>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-5">
              <p>
                <strong>Required:</strong> {signoffAssessment.requiredCount}
              </p>
              <p>
                <strong>Satisfied:</strong> {signoffAssessment.satisfiedCount}
              </p>
              <p>
                <strong>Pending:</strong> {signoffAssessment.pendingCount}
              </p>
              <p>
                <strong>Blocked:</strong> {signoffAssessment.blockedCount}
              </p>
              <p>
                <strong>Expired:</strong> {signoffAssessment.expiredCount}
              </p>
            </div>
            <ul className="mt-3 grid gap-2 text-xs md:grid-cols-2">
              {signoffAssessment.requirements.map((requirement) => (
                <li
                  key={requirement.requirementId}
                  className={`rounded-xl border p-3 ${requirementStateClass(
                    requirement.state
                  )}`}
                >
                  <p className="font-semibold capitalize">
                    {formatToken(requirement.accountableRole)} —{" "}
                    {formatToken(requirement.state)}
                  </p>
                  <p className="mt-1 leading-5">
                    {requirement.publicSafeSummary}
                  </p>
                  {requirement.conditions.length > 0 ? (
                    <p className="mt-1 text-[11px]">
                      Conditions recorded: {requirement.conditions.length}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {assessment.rows.map((row) => (
          <article
            key={row.claimId}
            className={`rounded-2xl border p-4 ${statusClass(row.status)}`}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                  {row.claimId}
                </p>
                <h3 className="mt-1 font-semibold">{row.title}</h3>
              </div>
              <p className="rounded-full border border-current/30 px-3 py-1 text-xs font-medium capitalize">
                {formatToken(row.status)}
              </p>
            </div>

            <div className="mt-3 grid gap-2 text-xs md:grid-cols-4">
              <p>
                <strong>Manifest:</strong>{" "}
                {formatToken(row.releaseManifestDisposition)}
              </p>
              <p>
                <strong>Evidence:</strong> {row.evidenceCount}
              </p>
              <p>
                <strong>Sources:</strong> {row.sourceCount}
              </p>
              <p>
                <strong>Source limits:</strong> {row.sourceLimitationCount}
              </p>
              <p>
                <strong>Review:</strong> {formatToken(row.reviewStatus)}
              </p>
              <p>
                <strong>Confidence:</strong> {formatToken(row.confidence)}
              </p>
              <p>
                <strong>Exposure:</strong> {formatToken(row.exposureRisk)}
              </p>
              <p>
                <strong>Right of reply:</strong>{" "}
                {formatToken(row.rightOfReplyStatus)}
              </p>
            </div>

            {row.issues.length > 0 ? (
              <ul className="mt-3 space-y-1 rounded-2xl border border-current/20 bg-white/65 p-3 text-xs">
                {row.issues.map((issue) => (
                  <li key={`${row.claimId}-${issue.type}`}>
                    <strong className="capitalize">{issue.severity}:</strong>{" "}
                    {formatToken(issue.type)} — {issue.publicSafeSummary}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-2xl border border-current/20 bg-white/65 p-3 text-xs">
                No structural dossier-readiness issues detected for this claim.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
