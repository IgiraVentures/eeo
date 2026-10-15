import { createHash } from "node:crypto";

import { canonicalizeEeoJson } from "@/lib/eeoJsonCanonicalization";
import type { Claim } from "@/types/eeo";
import type {
  ReviewObjectVersionBinding,
} from "@/types/reviewSignoff";

export const CLAIM_REVIEW_SCHEMA_VERSION = "claim-review-v1" as const;

/**
 * Exact claim fields governed by claim-level review sign-offs.
 *
 * Review workflow state is intentionally excluded: reviewStatus, lastReviewed,
 * governance review timestamps/notes, and correction-record identifiers must not
 * mutate the object under review merely because the review process advanced.
 *
 * staleAfter remains included because freshness limits are part of the public
 * claim posture that a reviewer approves.
 */
export function makeClaimReviewSnapshot(claim: Claim) {
  return {
    id: claim.id,
    recordMode: claim.recordMode,
    title: claim.title,
    plainLanguageClaim: claim.plainLanguageClaim,
    claimType: claim.claimType,
    legalPosture: claim.legalPosture,
    corridorNode: claim.corridorNode,
    evidenceLinks: claim.evidenceLinks,
    entityIds: claim.entityIds,
    confidence: claim.confidence,
    exposureRisk: claim.exposureRisk,
    publicationDecision: claim.publicationDecision,
    rightOfReplyRequired: claim.rightOfReplyRequired,
    rightOfReplyStatus: claim.rightOfReplyStatus,
    rightOfReplyReason: claim.rightOfReplyReason ?? null,
    whatThisDoesNotProve: claim.whatThisDoesNotProve,
    whatWouldReviseThisClaim: claim.whatWouldReviseThisClaim,
    lastUpdated: claim.lastUpdated,
    staleAfter: claim.staleAfter,
  };
}

export function sha256EeoJson(value: unknown): string {
  return createHash("sha256")
    .update(canonicalizeEeoJson(value), "utf8")
    .digest("hex");
}

export function makeClaimReviewObjectVersion(
  claim: Claim
): ReviewObjectVersionBinding {
  return {
    objectType: "claim",
    objectId: claim.id,
    schemaVersion: CLAIM_REVIEW_SCHEMA_VERSION,
    canonicalization: "eeo-json-v1",
    digestAlgorithm: "sha256",
    contentDigest: sha256EeoJson(makeClaimReviewSnapshot(claim)),
  };
}
