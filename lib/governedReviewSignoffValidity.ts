import type {
  GovernedReviewSignoff,
  ReviewObjectVersionBinding,
  ReviewSignoffRequirement,
} from "@/types/reviewSignoff";

export type GovernedSignoffValidityIssue =
  | "requirement_mismatch"
  | "binding_identity_mismatch"
  | "invalid_digest"
  | "object_version_mismatch"
  | "authority_not_verified"
  | "authority_role_mismatch"
  | "authority_scope_mismatch"
  | "authority_expired"
  | "signoff_expired"
  | "status_not_satisfying"
  | "invalid_review_timestamp"
  | "invalid_authority_timestamp"
  | "invalid_authority_expiry"
  | "invalid_signoff_expiry"
  | "conditioned_without_conditions";

export interface GovernedSignoffValidityAssessment {
  validForReleaseGate: boolean;
  issues: GovernedSignoffValidityIssue[];
  publicSafeSummary: string;
}

const SHA256_PATTERN = /^[a-f0-9]{64}$/i;

function isValidDate(value: string | undefined): boolean {
  return Boolean(value && !Number.isNaN(Date.parse(value)));
}

function isFuture(value: string | undefined, now: Date): boolean {
  return isValidDate(value) && new Date(value as string).getTime() > now.getTime();
}

function isExpired(value: string | undefined, now: Date): boolean {
  return isValidDate(value) && new Date(value as string).getTime() <= now.getTime();
}

function bindingsMatch(
  reviewed: ReviewObjectVersionBinding,
  current: ReviewObjectVersionBinding
): boolean {
  return (
    reviewed.objectType === current.objectType &&
    reviewed.objectId === current.objectId &&
    reviewed.schemaVersion === current.schemaVersion &&
    reviewed.canonicalization === current.canonicalization &&
    reviewed.digestAlgorithm === current.digestAlgorithm &&
    reviewed.contentDigest.toLowerCase() === current.contentDigest.toLowerCase()
  );
}

/**
 * Fail-closed structural validation for a governed review sign-off.
 *
 * This function does not authenticate a person, verify a digital signature,
 * persist an audit record, or authorize publication. It only confirms that a
 * repository representation is internally consistent with the exact current
 * object version and a separately verified authority record.
 */
export function assessGovernedReviewSignoffValidity({
  signoff,
  requirement,
  currentObjectVersion,
  now = new Date(),
}: {
  signoff: GovernedReviewSignoff;
  requirement: ReviewSignoffRequirement;
  currentObjectVersion: ReviewObjectVersionBinding;
  now?: Date;
}): GovernedSignoffValidityAssessment {
  const issues = new Set<GovernedSignoffValidityIssue>();

  if (
    requirement.objectType !== signoff.objectType ||
    requirement.objectId !== signoff.objectId ||
    requirement.reviewType !== signoff.reviewType
  ) {
    issues.add("requirement_mismatch");
  }

  if (
    signoff.objectVersion.objectType !== signoff.objectType ||
    signoff.objectVersion.objectId !== signoff.objectId ||
    currentObjectVersion.objectType !== signoff.objectType ||
    currentObjectVersion.objectId !== signoff.objectId
  ) {
    issues.add("binding_identity_mismatch");
  }

  if (
    !SHA256_PATTERN.test(signoff.objectVersion.contentDigest) ||
    !SHA256_PATTERN.test(currentObjectVersion.contentDigest)
  ) {
    issues.add("invalid_digest");
  }

  if (!bindingsMatch(signoff.objectVersion, currentObjectVersion)) {
    issues.add("object_version_mismatch");
  }

  if (signoff.authority.verificationStatus !== "verified") {
    issues.add("authority_not_verified");
  }

  if (
    !isValidDate(signoff.authority.verifiedAt) ||
    isFuture(signoff.authority.verifiedAt, now)
  ) {
    issues.add("invalid_authority_timestamp");
  }

  if (signoff.authority.accountableRole !== requirement.accountableRole) {
    issues.add("authority_role_mismatch");
  }

  if (
    !signoff.authority.permittedObjectTypes.includes(signoff.objectType) ||
    !signoff.authority.permittedReviewTypes.includes(signoff.reviewType)
  ) {
    issues.add("authority_scope_mismatch");
  }

  if (signoff.authority.expiresAt !== undefined) {
    if (!isValidDate(signoff.authority.expiresAt)) {
      issues.add("invalid_authority_expiry");
    } else if (isExpired(signoff.authority.expiresAt, now)) {
      issues.add("authority_expired");
    }
  }

  if (signoff.expiresAt !== undefined) {
    if (!isValidDate(signoff.expiresAt)) {
      issues.add("invalid_signoff_expiry");
    } else if (isExpired(signoff.expiresAt, now)) {
      issues.add("signoff_expired");
    }
  }

  if (signoff.status !== "approved" && signoff.status !== "conditioned") {
    issues.add("status_not_satisfying");
  }

  if (!isValidDate(signoff.reviewedAt) || isFuture(signoff.reviewedAt, now)) {
    issues.add("invalid_review_timestamp");
  }

  if (signoff.status === "conditioned" && signoff.conditions.length === 0) {
    issues.add("conditioned_without_conditions");
  }

  const issueList = [...issues];
  const validForReleaseGate = issueList.length === 0;

  return {
    validForReleaseGate,
    issues: issueList,
    publicSafeSummary: validForReleaseGate
      ? "The governed review record is structurally bound to the current object version and a current, in-scope authority record. This does not itself authorize release."
      : "The governed review record cannot satisfy a release gate because its version, authority, timing, scope, or decision posture is unresolved.",
  };
}
