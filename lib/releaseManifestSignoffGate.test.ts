import { describe, expect, it } from "vitest";

import { claimReviewRequirements } from "@/data/claimReviewRequirements";
import { claims, sampleClaim } from "@/data/claims";
import { releaseManifest } from "@/data/releaseManifest";
import {
  assessReleaseManifestSignoffGate,
} from "@/lib/releaseManifestSignoffGate";
import {
  makeClaimReviewObjectVersion,
} from "@/lib/reviewObjectVersion";
import type {
  GovernedReviewSignoff,
  ReviewSignoffRequirement,
} from "@/types/reviewSignoff";

function approvedSignoffForRequirement(
  requirement: ReviewSignoffRequirement
): GovernedReviewSignoff {
  const claim = claims.find((item) => item.id === requirement.objectId);
  if (!claim) {
    throw new Error(`Missing test claim ${requirement.objectId}`);
  }

  return {
    id: `RSIGN-${requirement.id}`,
    objectType: requirement.objectType,
    objectId: requirement.objectId,
    reviewType: requirement.reviewType,
    status: "approved",
    conditions: [],
    publicSafeSummary: "Required governed review completed for test.",
    reviewedAt: "2026-09-30T12:00:00.000Z",
    reviewedBy: "reviewer",
    objectVersion: makeClaimReviewObjectVersion(claim),
    authority: {
      authorityId: `AUTH-${requirement.id}`,
      accountableRole: requirement.accountableRole,
      basisReference: `AUTH-BASIS-${requirement.id}`,
      verificationStatus: "verified",
      verifiedAt: "2026-09-30T11:00:00.000Z",
      expiresAt: "2027-09-30T11:00:00.000Z",
      permittedObjectTypes: [requirement.objectType],
      permittedReviewTypes: [requirement.reviewType],
    },
  };
}

function approvedSignoffsForClaim(claimId: string): GovernedReviewSignoff[] {
  return claimReviewRequirements
    .filter((requirement) => requirement.objectId === claimId)
    .map(approvedSignoffForRequirement);
}

const currentObjectVersions = claims.map(makeClaimReviewObjectVersion);
const now = new Date("2026-09-30T18:00:00.000Z");

describe("assessReleaseManifestSignoffGate", () => {
  it("blocks the current manifest while governed signoffs are absent", () => {
    const assessment = assessReleaseManifestSignoffGate({
      releaseManifest,
      requirements: claimReviewRequirements,
      signoffs: [],
      currentObjectVersions,
      now,
    });

    expect(assessment.passes).toBe(false);
    expect(assessment.claimsPendingReview).toContain("CLAIM-DRC-CO-001");
    expect(assessment.claimsMissingRequirements).toEqual([]);
    expect(assessment.claimsMissingObjectVersions).toEqual([]);
  });

  it("passes only when every included requirement has a current version-bound governed signoff", () => {
    const assessment = assessReleaseManifestSignoffGate({
      releaseManifest,
      requirements: claimReviewRequirements,
      signoffs: approvedSignoffsForClaim("CLAIM-DRC-CO-001"),
      currentObjectVersions,
      now,
    });

    expect(assessment.passes).toBe(true);
    expect(assessment.claimAssessments[0]?.releaseEligible).toBe(true);
  });

  it("fails closed when an approval is bound to stale claim content", () => {
    const signoffs = approvedSignoffsForClaim("CLAIM-DRC-CO-001");
    signoffs[0] = {
      ...signoffs[0]!,
      objectVersion: {
        ...signoffs[0]!.objectVersion,
        contentDigest: "b".repeat(64),
      },
    };

    const assessment = assessReleaseManifestSignoffGate({
      releaseManifest,
      requirements: claimReviewRequirements,
      signoffs,
      currentObjectVersions,
      now,
    });

    expect(assessment.passes).toBe(false);
    expect(assessment.claimsPendingReview).toContain("CLAIM-DRC-CO-001");
    expect(assessment.claimAssessments[0]?.satisfiedCount).toBe(
      claimReviewRequirements.filter(
        (requirement) => requirement.objectId === "CLAIM-DRC-CO-001"
      ).length - 1
    );
  });

  it("fails closed when the current claim version is not supplied", () => {
    const assessment = assessReleaseManifestSignoffGate({
      releaseManifest,
      requirements: claimReviewRequirements,
      signoffs: approvedSignoffsForClaim("CLAIM-DRC-CO-001"),
      currentObjectVersions: [],
      now,
    });

    expect(assessment.passes).toBe(false);
    expect(assessment.claimsMissingObjectVersions).toEqual([
      "CLAIM-DRC-CO-001",
    ]);
  });

  it("blocks a newly included claim whose review lanes remain pending", () => {
    const assessment = assessReleaseManifestSignoffGate({
      releaseManifest: {
        id: "REL-TEST-002",
        includedClaimIds: ["CLAIM-DRC-CO-001", "CLAIM-DRC-CO-002"],
      },
      requirements: claimReviewRequirements,
      signoffs: approvedSignoffsForClaim("CLAIM-DRC-CO-001"),
      currentObjectVersions,
      now,
    });

    expect(assessment.passes).toBe(false);
    expect(assessment.claimsPendingReview).toContain("CLAIM-DRC-CO-002");
  });

  it("blocks included claims that have no declared review requirements", () => {
    const assessment = assessReleaseManifestSignoffGate({
      releaseManifest: {
        id: "REL-TEST-003",
        includedClaimIds: ["CLAIM-UNKNOWN-001"],
      },
      requirements: claimReviewRequirements,
      signoffs: [],
      currentObjectVersions: [],
      now,
    });

    expect(assessment.passes).toBe(false);
    expect(assessment.claimsMissingRequirements).toEqual([
      "CLAIM-UNKNOWN-001",
    ]);
  });

  it("blocks a manifest when a required governed decision is expired", () => {
    const signoffs = approvedSignoffsForClaim("CLAIM-DRC-CO-001");
    signoffs[0] = {
      ...signoffs[0]!,
      expiresAt: "2026-09-30T17:00:00.000Z",
    };

    const assessment = assessReleaseManifestSignoffGate({
      releaseManifest,
      requirements: claimReviewRequirements,
      signoffs,
      currentObjectVersions,
      now,
    });

    expect(assessment.passes).toBe(false);
    expect(assessment.claimsWithExpiredReview).toContain(
      "CLAIM-DRC-CO-001"
    );
  });

  it("binds the test fixture to the repository's actual release-scoped claim", () => {
    expect(makeClaimReviewObjectVersion(sampleClaim)).toEqual(
      currentObjectVersions.find(
        (version) => version.objectId === "CLAIM-DRC-CO-001"
      )
    );
  });
});
