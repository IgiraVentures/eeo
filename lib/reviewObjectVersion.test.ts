import { describe, expect, it } from "vitest";

import { sampleClaim } from "@/data/claims";
import {
  makeClaimReviewObjectVersion,
  makeClaimReviewSnapshot,
  sha256EeoJson,
} from "@/lib/reviewObjectVersion";
import type { Claim } from "@/types/eeo";

function cloneClaim(overrides: Partial<Claim> = {}): Claim {
  return {
    ...sampleClaim,
    evidenceLinks: sampleClaim.evidenceLinks.map((link) => ({ ...link })),
    entityIds: [...sampleClaim.entityIds],
    whatThisDoesNotProve: [...sampleClaim.whatThisDoesNotProve],
    whatWouldReviseThisClaim: [...sampleClaim.whatWouldReviseThisClaim],
    ...overrides,
  };
}

describe("claim review object version", () => {
  it("is deterministic for the same governed claim scope", () => {
    const first = makeClaimReviewObjectVersion(cloneClaim());
    const second = makeClaimReviewObjectVersion(cloneClaim());

    expect(first).toEqual(second);
    expect(first.contentDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(first.canonicalization).toBe("eeo-json-v1");
    expect(first.digestAlgorithm).toBe("sha256");
  });

  it("ignores review-process metadata that must not mutate the reviewed object", () => {
    const baseline = makeClaimReviewObjectVersion(cloneClaim());
    const changedReviewMetadata = makeClaimReviewObjectVersion(
      cloneClaim({
        reviewStatus: "legal_review",
        lastReviewed: "2026-09-30",
        governanceStatus: "under_review",
        lastGovernanceReviewAt: "2026-09-30",
        governanceNote: "Internal workflow note.",
        linkedCorrectionIds: ["CORR-TEST-001"],
      })
    );

    expect(changedReviewMetadata.contentDigest).toBe(baseline.contentDigest);
  });

  const materialChanges: Array<[string, Partial<Claim>]> = [
    ["wording", { plainLanguageClaim: "Materially changed public claim wording." }],
    ["evidence", { evidenceLinks: [] }],
    ["confidence", { confidence: "medium" }],
    ["publication posture", { publicationDecision: "withhold" }],
    ["right of reply", { rightOfReplyRequired: true }],
    ["freshness limit", { staleAfter: "2027-01-01" }],
  ];

  it.each(materialChanges)("changes the digest when %s changes", (_label, overrides) => {
    const baseline = makeClaimReviewObjectVersion(cloneClaim());
    const changed = makeClaimReviewObjectVersion(cloneClaim(overrides));

    expect(changed.contentDigest).not.toBe(baseline.contentDigest);
  });

  it("hashes only the explicit claim review snapshot", () => {
    const snapshot = makeClaimReviewSnapshot(cloneClaim());

    expect(snapshot).not.toHaveProperty("reviewStatus");
    expect(snapshot).not.toHaveProperty("lastReviewed");
    expect(snapshot).not.toHaveProperty("governanceNote");
    expect(snapshot).not.toHaveProperty("linkedCorrectionIds");
    expect(makeClaimReviewObjectVersion(cloneClaim()).contentDigest).toBe(
      sha256EeoJson(snapshot)
    );
  });
});
