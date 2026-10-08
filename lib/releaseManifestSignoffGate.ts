import { assessGovernedReviewSignoffValidity } from "@/lib/governedReviewSignoffValidity";
import type { ReleaseManifest } from "@/types/eeo";
import type {
  GovernedReviewSignoff,
  ReviewObjectVersionBinding,
  ReviewSignoffRequirement,
} from "@/types/reviewSignoff";

export interface ReleaseManifestClaimSignoffAssessment {
  claimId: string;
  requiredCount: number;
  satisfiedCount: number;
  pendingCount: number;
  blockedCount: number;
  expiredCount: number;
  releaseEligible: boolean;
  publicSafeSummary: string;
}

export interface ReleaseManifestSignoffGateAssessment {
  manifestId: string;
  passes: boolean;
  includedClaimCount: number;
  claimsMissingRequirements: string[];
  claimsMissingObjectVersions: string[];
  claimsPendingReview: string[];
  claimsBlockedByReview: string[];
  claimsWithExpiredReview: string[];
  claimAssessments: ReleaseManifestClaimSignoffAssessment[];
  publicSafeSummary: string;
}

function newestFirst(a: GovernedReviewSignoff, b: GovernedReviewSignoff): number {
  const bTime = Date.parse(b.reviewedAt);
  const aTime = Date.parse(a.reviewedAt);

  if (Number.isNaN(bTime) && Number.isNaN(aTime)) return 0;
  if (Number.isNaN(bTime)) return 1;
  if (Number.isNaN(aTime)) return -1;
  return bTime - aTime;
}

function currentVersionForClaim(
  claimId: string,
  versions: ReviewObjectVersionBinding[]
): ReviewObjectVersionBinding | undefined {
  return versions.find(
    (version) => version.objectType === "claim" && version.objectId === claimId
  );
}

function latestSignoffForRequirement(
  requirement: ReviewSignoffRequirement,
  signoffs: GovernedReviewSignoff[]
): GovernedReviewSignoff | undefined {
  return signoffs
    .filter(
      (signoff) =>
        signoff.objectType === requirement.objectType &&
        signoff.objectId === requirement.objectId &&
        signoff.reviewType === requirement.reviewType &&
        signoff.status !== "superseded"
    )
    .sort(newestFirst)[0];
}

/**
 * Fail-closed release gate for claim-level governed review sign-offs.
 *
 * A declared requirement can be satisfied only by the latest governed sign-off
 * for the same lane when that record:
 * - is bound to the exact current object version;
 * - carries a valid SHA-256 eeo-json-v1 digest;
 * - is backed by a verified, current, in-scope accountable authority; and
 * - has a current satisfying decision state.
 *
 * This function does not authenticate a person, persist an audit record, sign a
 * release manifest, or publish anything. Those remain separate operational
 * controls.
 */
export function assessReleaseManifestSignoffGate(params: {
  releaseManifest: Pick<ReleaseManifest, "id" | "includedClaimIds">;
  requirements: ReviewSignoffRequirement[];
  signoffs: GovernedReviewSignoff[];
  currentObjectVersions: ReviewObjectVersionBinding[];
  now?: Date;
}): ReleaseManifestSignoffGateAssessment {
  const now = params.now ?? new Date();
  const claimAssessments: ReleaseManifestClaimSignoffAssessment[] = [];
  const claimsMissingRequirements: string[] = [];
  const claimsMissingObjectVersions: string[] = [];
  const claimsPendingReview: string[] = [];
  const claimsBlockedByReview: string[] = [];
  const claimsWithExpiredReview: string[] = [];

  for (const claimId of params.releaseManifest.includedClaimIds) {
    const claimRequirements = params.requirements.filter(
      (requirement) =>
        requirement.required &&
        requirement.objectType === "claim" &&
        requirement.objectId === claimId
    );

    if (claimRequirements.length === 0) {
      claimsMissingRequirements.push(claimId);
      continue;
    }

    const currentObjectVersion = currentVersionForClaim(
      claimId,
      params.currentObjectVersions
    );

    if (!currentObjectVersion) {
      claimsMissingObjectVersions.push(claimId);
      continue;
    }

    let satisfiedCount = 0;
    let pendingCount = 0;
    let blockedCount = 0;
    let expiredCount = 0;

    for (const requirement of claimRequirements) {
      const signoff = latestSignoffForRequirement(requirement, params.signoffs);

      if (!signoff) {
        pendingCount += 1;
        continue;
      }

      const validity = assessGovernedReviewSignoffValidity({
        signoff,
        requirement,
        currentObjectVersion,
        now,
      });

      if (validity.validForReleaseGate) {
        satisfiedCount += 1;
        continue;
      }

      if (
        validity.issues.includes("authority_expired") ||
        validity.issues.includes("signoff_expired") ||
        signoff.status === "expired"
      ) {
        expiredCount += 1;
        continue;
      }

      if (signoff.status === "blocked" || signoff.status === "withdrawn") {
        blockedCount += 1;
        continue;
      }

      pendingCount += 1;
    }

    const releaseEligible =
      satisfiedCount === claimRequirements.length &&
      pendingCount === 0 &&
      blockedCount === 0 &&
      expiredCount === 0;

    claimAssessments.push({
      claimId,
      requiredCount: claimRequirements.length,
      satisfiedCount,
      pendingCount,
      blockedCount,
      expiredCount,
      releaseEligible,
      publicSafeSummary: releaseEligible
        ? "All required review lanes have current governed sign-offs bound to this exact claim version. Manifest authorization remains a separate release-authority action."
        : "One or more required review lanes lack a current, version-bound, in-scope governed decision. The claim is not eligible for manifest release.",
    });

    if (pendingCount > 0) {
      claimsPendingReview.push(claimId);
    }
    if (blockedCount > 0) {
      claimsBlockedByReview.push(claimId);
    }
    if (expiredCount > 0) {
      claimsWithExpiredReview.push(claimId);
    }
  }

  const passes =
    claimsMissingRequirements.length === 0 &&
    claimsMissingObjectVersions.length === 0 &&
    claimsPendingReview.length === 0 &&
    claimsBlockedByReview.length === 0 &&
    claimsWithExpiredReview.length === 0 &&
    claimAssessments.length === params.releaseManifest.includedClaimIds.length &&
    claimAssessments.every((assessment) => assessment.releaseEligible);

  return {
    manifestId: params.releaseManifest.id,
    passes,
    includedClaimCount: params.releaseManifest.includedClaimIds.length,
    claimsMissingRequirements,
    claimsMissingObjectVersions,
    claimsPendingReview,
    claimsBlockedByReview,
    claimsWithExpiredReview,
    claimAssessments,
    publicSafeSummary: passes
      ? "Every included claim has declared requirements and current governed sign-offs bound to its exact review version. This structural pass does not itself sign or publish the manifest."
      : "One or more included claims lack requirements, lack a current review version, or have unresolved governed review lanes. The manifest is not eligible for release.",
  };
}
