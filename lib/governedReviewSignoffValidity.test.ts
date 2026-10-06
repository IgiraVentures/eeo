import { describe, expect, it } from "vitest";

import { assessGovernedReviewSignoffValidity } from "@/lib/governedReviewSignoffValidity";
import type {
  GovernedReviewSignoff,
  ReviewObjectVersionBinding,
  ReviewSignoffRequirement,
} from "@/types/reviewSignoff";

const currentObjectVersion: ReviewObjectVersionBinding = {
  objectType: "claim",
  objectId: "CLAIM-TEST-001",
  schemaVersion: "claim-v1",
  canonicalization: "eeo-json-v1",
  digestAlgorithm: "sha256",
  contentDigest: "a".repeat(64),
};

const requirement: ReviewSignoffRequirement = {
  id: "RREQ-TEST-METHOD",
  objectType: "claim",
  objectId: "CLAIM-TEST-001",
  reviewType: "method_review",
  accountableRole: "method_reviewer",
  required: true,
  rationale: "Confirm the method for the exact claim version.",
  publicSafeSummary: "Method review is required for the exact claim version.",
};

function governedSignoff(
  overrides: Partial<GovernedReviewSignoff> = {}
): GovernedReviewSignoff {
  return {
    id: "RSIGN-TEST-001",
    objectType: "claim",
    objectId: "CLAIM-TEST-001",
    reviewType: "method_review",
    status: "approved",
    conditions: [],
    publicSafeSummary: "Method review completed for the bound claim version.",
    reviewedAt: "2026-07-30T12:00:00.000Z",
    reviewedBy: "reviewer",
    objectVersion: { ...currentObjectVersion },
    authority: {
      authorityId: "AUTH-TEST-METHOD-001",
      accountableRole: "method_reviewer",
      basisReference: "AUTH-BASIS-TEST-001",
      verificationStatus: "verified",
      verifiedAt: "2026-07-30T11:00:00.000Z",
      expiresAt: "2027-07-30T11:00:00.000Z",
      permittedObjectTypes: ["claim"],
      permittedReviewTypes: ["method_review"],
    },
    ...overrides,
  };
}

const now = new Date("2026-07-30T18:00:00.000Z");

describe("assessGovernedReviewSignoffValidity", () => {
  it("accepts a structurally current version-bound, in-scope governed decision", () => {
    const assessment = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff(),
      requirement,
      currentObjectVersion,
      now,
    });

    expect(assessment.validForReleaseGate).toBe(true);
    expect(assessment.issues).toEqual([]);
    expect(assessment.publicSafeSummary).toContain("does not itself authorize release");
  });

  it("fails closed when the reviewed content digest no longer matches", () => {
    const assessment = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff({
        objectVersion: {
          ...currentObjectVersion,
          contentDigest: "b".repeat(64),
        },
      }),
      requirement,
      currentObjectVersion,
      now,
    });

    expect(assessment.validForReleaseGate).toBe(false);
    expect(assessment.issues).toContain("object_version_mismatch");
  });

  it.each(["pending", "revoked", "expired"] as const)(
    "rejects %s authority verification status",
    (verificationStatus) => {
      const assessment = assessGovernedReviewSignoffValidity({
        signoff: governedSignoff({
          authority: {
            ...governedSignoff().authority,
            verificationStatus,
          },
        }),
        requirement,
        currentObjectVersion,
        now,
      });

      expect(assessment.validForReleaseGate).toBe(false);
      expect(assessment.issues).toContain("authority_not_verified");
    }
  );

  it("rejects authority whose role or scope does not satisfy the requirement", () => {
    const assessment = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff({
        authority: {
          ...governedSignoff().authority,
          accountableRole: "evidence_steward",
          permittedReviewTypes: ["evidence_review"],
        },
      }),
      requirement,
      currentObjectVersion,
      now,
    });

    expect(assessment.validForReleaseGate).toBe(false);
    expect(assessment.issues).toContain("authority_role_mismatch");
    expect(assessment.issues).toContain("authority_scope_mismatch");
  });

  it("rejects expired authority and expired signoff records", () => {
    const assessment = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff({
        expiresAt: "2026-07-30T17:00:00.000Z",
        authority: {
          ...governedSignoff().authority,
          expiresAt: "2026-07-30T17:00:00.000Z",
        },
      }),
      requirement,
      currentObjectVersion,
      now,
    });

    expect(assessment.validForReleaseGate).toBe(false);
    expect(assessment.issues).toContain("authority_expired");
    expect(assessment.issues).toContain("signoff_expired");
  });

  it("rejects future review and authority verification timestamps", () => {
    const assessment = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff({
        reviewedAt: "2026-07-30T19:00:00.000Z",
        authority: {
          ...governedSignoff().authority,
          verifiedAt: "2026-07-30T19:00:00.000Z",
        },
      }),
      requirement,
      currentObjectVersion,
      now,
    });

    expect(assessment.validForReleaseGate).toBe(false);
    expect(assessment.issues).toContain("invalid_review_timestamp");
    expect(assessment.issues).toContain("invalid_authority_timestamp");
  });

  it("rejects supplied malformed authority and signoff expiry timestamps", () => {
    const assessment = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff({
        expiresAt: "not-a-date",
        authority: {
          ...governedSignoff().authority,
          expiresAt: "also-not-a-date",
        },
      }),
      requirement,
      currentObjectVersion,
      now,
    });

    expect(assessment.validForReleaseGate).toBe(false);
    expect(assessment.issues).toContain("invalid_authority_expiry");
    expect(assessment.issues).toContain("invalid_signoff_expiry");
  });

  it("rejects blocked decisions and empty conditioned decisions", () => {
    const blocked = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff({ status: "blocked" }),
      requirement,
      currentObjectVersion,
      now,
    });
    const emptyConditioned = assessGovernedReviewSignoffValidity({
      signoff: governedSignoff({ status: "conditioned", conditions: [] }),
      requirement,
      currentObjectVersion,
      now,
    });

    expect(blocked.issues).toContain("status_not_satisfying");
    expect(emptyConditioned.issues).toContain("conditioned_without_conditions");
  });
});
