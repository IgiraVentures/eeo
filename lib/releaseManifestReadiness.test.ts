import { describe, expect, it } from "vitest";

import { claims as currentClaims } from "@/data/claims";
import { copperCobaltCorridorPilotSkeleton } from "@/data/corridorDossier";
import { evidenceItems as currentEvidenceItems } from "@/data/evidence";
import { sources as currentSources } from "@/data/sources";
import { canClaimBeApprovedForRelease } from "@/lib/publicationRules";
import { assessReleaseManifestReadiness } from "@/lib/releaseManifestReadiness";
import type {
  ReleaseManifestMapSafetyObject,
  ReleaseManifestMapSafetyReview,
} from "@/lib/releaseManifestReadiness";
import type { CorridorDossier } from "@/types/corridorDossier";
import type { Claim, EvidenceItem, Source } from "@/types/eeo";

const baseSource: Source = {
  id: "SRC-TEST-001",
  recordMode: "illustrative",
  title: "Test source",
  publisher: "Test publisher",
  sourceType: "other",
  accessedDate: "2026-05-25",
  licenseStatus: "open",
  notes: "Internal source note should not be returned.",
};

const baseClaim: Claim = {
  id: "CLAIM-TEST-001",
  recordMode: "synthetic",
  title: "Test claim",
  plainLanguageClaim: "A test-only claim fixture.",
  claimType: "descriptive",
  legalPosture: "factual_observation",
  corridorNode: "endowment",
  evidenceLinks: [{ evidenceId: "EVID-TEST-001", role: "supports" }],
  entityIds: ["ENT-TEST"],
  confidence: "high",
  exposureRisk: "low",
  publicationDecision: "publish",
  reviewStatus: "approved_for_release",
  rightOfReplyRequired: false,
  rightOfReplyStatus: "not_required",
  whatThisDoesNotProve: ["It does not make a real-world factual assertion."],
  whatWouldReviseThisClaim: ["A changed test fixture."],
  lastUpdated: "2026-05-25",
  lastReviewed: "2026-01-01",
  staleAfter: "2026-07-01",
  governanceNote: "Internal governance note should not be returned.",
};

const baseEvidenceItem: EvidenceItem = {
  id: "EVID-TEST-001",
  recordMode: "illustrative",
  sourceId: "SRC-TEST-001",
  title: "Test evidence",
  summary: "Test-only evidence fixture.",
  evidenceClass: "official",
  confidenceContribution: "high",
  limitations: ["Test-only limitation."],
  exposureRisk: "low",
  publicationDecision: "publish",
  claimLinks: [{ claimId: "CLAIM-TEST-001", role: "supports" }],
};

const baseDossier: CorridorDossier = {
  id: "CDR-TEST-001",
  recordMode: "illustrative",
  title: "Test dossier",
  corridor: "Test corridor",
  geography: "Test geography",
  commodityFocus: ["test"],
  purpose: "Exercise release manifest readiness helper behavior.",
  scopeStatement: "Test-only scope.",
  nonGoals: ["No factual claims are made by this test fixture."],
  sections: [
    {
      id: "CDS-TEST-scope",
      recordMode: "illustrative",
      section: "scope",
      title: "Scope",
      status: "ready_for_release",
      summary: "Structural test section.",
      linkedClaimIds: ["CLAIM-TEST-001"],
      linkedEvidenceIds: ["EVID-TEST-001"],
      sourceIds: ["SRC-TEST-001"],
      publicLimitations: ["Prototype test limitation."],
      exposureNotes: ["Internal section note should not be returned."],
      lastUpdated: "2026-05-25T00:00:00.000Z",
    },
  ],
  releaseReadiness: "release_candidate",
  publicLimitations: ["Prototype test limitation."],
  lastUpdated: "2026-05-25T00:00:00.000Z",
};

const baseMapSafetyObject: ReleaseManifestMapSafetyObject = {
  id: "MAP-TEST-001",
  title: "Test map object",
  reviewId: "MSR-TEST-001",
};

const baseMapSafetyReview: ReleaseManifestMapSafetyReview = {
  id: "MSR-TEST-001",
  layerName: "Test map layer",
  classification: "generalized",
  publicRationale: "Generalized test fixture.",
  risksConsidered: ["Sensitive location exposure risk."],
  mitigation: ["Generalize location detail."],
  reviewedAt: "2026-05-25T00:00:00.000Z",
  reviewerRole: "exposure",
};

function claimWith(overrides: Partial<Claim>): Claim {
  return { ...baseClaim, ...overrides };
}

function evidenceItemWith(overrides: Partial<EvidenceItem>): EvidenceItem {
  return { ...baseEvidenceItem, ...overrides };
}

function sourceWith(overrides: Partial<Source>): Source {
  return { ...baseSource, ...overrides };
}

function dossierWith(params: {
  linkedClaimIds: string[];
  linkedEvidenceIds: string[];
  sourceIds?: string[];
}): CorridorDossier {
  return {
    ...baseDossier,
    sections: [
      {
        ...baseDossier.sections[0],
        linkedClaimIds: params.linkedClaimIds,
        linkedEvidenceIds: params.linkedEvidenceIds,
        sourceIds: params.sourceIds ?? ["SRC-TEST-001"],
      },
    ],
  };
}

function issueTypes(
  assessment: ReturnType<typeof assessReleaseManifestReadiness>
): string[] {
  return assessment.blockingStructuralIssues.map((issue) => issue.type);
}

function reviewFlagTypes(
  assessment: ReturnType<typeof assessReleaseManifestReadiness>
): string[] {
  return assessment.reviewFlags.map((flag) => flag.type);
}

describe("assessReleaseManifestReadiness", () => {
  it("reports the current copper-cobalt dossier as not manifest-ready because the dossier remains not_ready and incomplete", () => {
    const assessment = assessReleaseManifestReadiness({
      dossier: copperCobaltCorridorPilotSkeleton,
      claims: currentClaims,
      evidenceItems: currentEvidenceItems,
      sources: currentSources,
    });

    expect(assessment.releaseReadiness).toBe("not_ready");
    expect(assessment.dossierReady).toBe(false);
    expect(issueTypes(assessment)).toContain("dossier_release_not_ready");
    expect(issueTypes(assessment)).toContain("dossier_sections_incomplete");
  });

  it("counts approvable claims using canClaimBeApprovedForRelease", () => {
    const nonApprovableClaim = claimWith({
      id: "CLAIM-TEST-002",
      title: "Non-approvable test claim",
      reviewStatus: "method_review",
      evidenceLinks: [{ evidenceId: "EVID-TEST-002", role: "supports" }],
    });
    const secondEvidenceItem = evidenceItemWith({
      id: "EVID-TEST-002",
      claimLinks: [{ claimId: "CLAIM-TEST-002", role: "supports" }],
    });
    const claims = [baseClaim, nonApprovableClaim];

    const assessment = assessReleaseManifestReadiness({
      dossier: dossierWith({
        linkedClaimIds: claims.map((claim) => claim.id),
        linkedEvidenceIds: ["EVID-TEST-001", "EVID-TEST-002"],
      }),
      claims,
      evidenceItems: [baseEvidenceItem, secondEvidenceItem],
      sources: [baseSource],
    });

    expect(assessment.approvableClaims).toBe(
      claims.filter(canClaimBeApprovedForRelease).length
    );
  });

  it("counts non-approvable claims", () => {
    const nonApprovableClaim = claimWith({
      id: "CLAIM-TEST-002",
      title: "Non-approvable test claim",
      publicationDecision: "publish_with_redactions",
      evidenceLinks: [{ evidenceId: "EVID-TEST-002", role: "supports" }],
    });
    const secondEvidenceItem = evidenceItemWith({
      id: "EVID-TEST-002",
      claimLinks: [{ claimId: "CLAIM-TEST-002", role: "supports" }],
    });

    const assessment = assessReleaseManifestReadiness({
      dossier: dossierWith({
        linkedClaimIds: ["CLAIM-TEST-001", "CLAIM-TEST-002"],
        linkedEvidenceIds: ["EVID-TEST-001", "EVID-TEST-002"],
      }),
      claims: [baseClaim, nonApprovableClaim],
      evidenceItems: [baseEvidenceItem, secondEvidenceItem],
      sources: [baseSource],
    });

    expect(assessment.nonApprovableClaims).toBe(1);
    expect(reviewFlagTypes(assessment)).toContain("non_approvable_claims");
  });

  it("creates structural blockers for missing evidence and source links", () => {
    const claimReferencingMissingEvidence = claimWith({
      evidenceLinks: [{ evidenceId: "EVID-MISSING", role: "supports" }],
    });
    const claimReferencingEvidenceWithMissingSource = claimWith({
      id: "CLAIM-TEST-002",
      title: "Missing source test claim",
      evidenceLinks: [{ evidenceId: "EVID-TEST-002", role: "supports" }],
    });
    const evidenceWithMissingSource = evidenceItemWith({
      id: "EVID-TEST-002",
      sourceId: "SRC-MISSING",
      claimLinks: [{ claimId: "CLAIM-TEST-002", role: "supports" }],
    });

    const assessment = assessReleaseManifestReadiness({
      dossier: dossierWith({
        linkedClaimIds: ["CLAIM-TEST-001", "CLAIM-TEST-002"],
        linkedEvidenceIds: ["EVID-MISSING", "EVID-TEST-002"],
        sourceIds: ["SRC-MISSING"],
      }),
      claims: [
        claimReferencingMissingEvidence,
        claimReferencingEvidenceWithMissingSource,
      ],
      evidenceItems: [evidenceWithMissingSource],
      sources: [],
    });

    expect(assessment.evidenceIntegrityPasses).toBe(false);
    expect(assessment.sourceReadinessPasses).toBe(false);
    expect(issueTypes(assessment)).toContain(
      "claims_reference_missing_evidence"
    );
    expect(issueTypes(assessment)).toContain(
      "evidence_references_missing_sources"
    );
  });

  it("does not create a map-safety blocker when there are no map-sensitive objects", () => {
    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [baseClaim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
    });

    expect(assessment.mapSafetyReadinessPasses).toBe(true);
    expect(assessment.mapSafetyMissingReviewObjects).toEqual([]);
    expect(assessment.mapSafetyBlockedObjects).toEqual([]);
    expect(issueTypes(assessment)).not.toContain("map_safety_review_missing");
    expect(issueTypes(assessment)).not.toContain(
      "map_safety_blocked_classification"
    );
  });

  it("creates a structural blocker for a map-sensitive object without review", () => {
    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [baseClaim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
      mapSafetyObjects: [
        {
          id: "MAP-TEST-MISSING-REVIEW",
          title: "Map object missing review",
        },
      ],
      mapSafetyReviews: [],
    });

    expect(assessment.mapSafetyReadinessPasses).toBe(false);
    expect(assessment.mapSafetyMissingReviewObjects).toEqual([
      {
        id: "MAP-TEST-MISSING-REVIEW",
        title: "Map object missing review",
        disposition: "release_bound",
      },
    ]);
    expect(issueTypes(assessment)).toContain("map_safety_review_missing");
  });

  it("creates a structural blocker for restricted and do_not_publish map-safety classifications", () => {
    const restrictedObject: ReleaseManifestMapSafetyObject = {
      id: "MAP-TEST-RESTRICTED",
      title: "Restricted map object",
      reviewId: "MSR-TEST-RESTRICTED",
    };
    const doNotPublishObject: ReleaseManifestMapSafetyObject = {
      id: "MAP-TEST-DO-NOT-PUBLISH",
      title: "Do-not-publish map object",
      reviewId: "MSR-TEST-DO-NOT-PUBLISH",
    };

    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [baseClaim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
      mapSafetyObjects: [restrictedObject, doNotPublishObject],
      mapSafetyReviews: [
        {
          ...baseMapSafetyReview,
          id: "MSR-TEST-RESTRICTED",
          classification: "restricted",
        },
        {
          ...baseMapSafetyReview,
          id: "MSR-TEST-DO-NOT-PUBLISH",
          classification: "do_not_publish",
        },
      ],
    });

    expect(assessment.mapSafetyReadinessPasses).toBe(false);
    expect(assessment.mapSafetyBlockedObjects).toEqual([
      {
        id: "MAP-TEST-RESTRICTED",
        title: "Restricted map object",
        disposition: "release_bound",
        classification: "restricted",
      },
      {
        id: "MAP-TEST-DO-NOT-PUBLISH",
        title: "Do-not-publish map object",
        disposition: "release_bound",
        classification: "do_not_publish",
      },
    ]);
    expect(issueTypes(assessment)).toContain(
      "map_safety_blocked_classification"
    );
  });

  it("does not create a map-safety blocker for generalized, aggregated, or blurred classifications with review", () => {
    const mapSafetyObjects: ReleaseManifestMapSafetyObject[] = [
      {
        id: "MAP-TEST-GENERALIZED",
        title: "Generalized map object",
        reviewId: "MSR-TEST-GENERALIZED",
      },
      {
        id: "MAP-TEST-AGGREGATED",
        title: "Aggregated map object",
        reviewId: "MSR-TEST-AGGREGATED",
      },
      {
        id: "MAP-TEST-BLURRED",
        title: "Blurred map object",
        reviewId: "MSR-TEST-BLURRED",
      },
    ];

    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [baseClaim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
      mapSafetyObjects,
      mapSafetyReviews: [
        {
          ...baseMapSafetyReview,
          id: "MSR-TEST-GENERALIZED",
          classification: "generalized",
        },
        {
          ...baseMapSafetyReview,
          id: "MSR-TEST-AGGREGATED",
          classification: "aggregated",
        },
        {
          ...baseMapSafetyReview,
          id: "MSR-TEST-BLURRED",
          classification: "blurred",
        },
      ],
    });

    expect(assessment.mapSafetyReadinessPasses).toBe(true);
    expect(assessment.mapSafetyMissingReviewObjects).toEqual([]);
    expect(assessment.mapSafetyBlockedObjects).toEqual([]);
    expect(issueTypes(assessment)).not.toContain("map_safety_review_missing");
    expect(issueTypes(assessment)).not.toContain(
      "map_safety_blocked_classification"
    );
  });

  it("creates review flags, not automatic blockers, for unknown, restricted, and permission-required source posture", () => {
    const sourceWithUnknownLicense = sourceWith({
      id: "SRC-UNKNOWN",
      licenseStatus: "unknown",
    });
    const restrictedSource = sourceWith({
      id: "SRC-RESTRICTED",
      licenseStatus: "restricted",
    });
    const permissionRequiredSource = sourceWith({
      id: "SRC-PERMISSION",
      licenseStatus: "permission_required",
    });
    const evidenceItems = [
      evidenceItemWith({
        id: "EVID-UNKNOWN",
        sourceId: "SRC-UNKNOWN",
        claimLinks: [{ claimId: "CLAIM-TEST-001", role: "supports" }],
      }),
      evidenceItemWith({
        id: "EVID-RESTRICTED",
        sourceId: "SRC-RESTRICTED",
        claimLinks: [{ claimId: "CLAIM-TEST-001", role: "supports" }],
      }),
      evidenceItemWith({
        id: "EVID-PERMISSION",
        sourceId: "SRC-PERMISSION",
        claimLinks: [{ claimId: "CLAIM-TEST-001", role: "supports" }],
      }),
    ];
    const claim = claimWith({
      evidenceLinks: evidenceItems.map((evidenceItem) => ({
        evidenceId: evidenceItem.id,
        role: "supports",
      })),
    });

    const assessment = assessReleaseManifestReadiness({
      dossier: dossierWith({
        linkedClaimIds: ["CLAIM-TEST-001"],
        linkedEvidenceIds: evidenceItems.map((evidenceItem) => evidenceItem.id),
        sourceIds: ["SRC-UNKNOWN", "SRC-RESTRICTED", "SRC-PERMISSION"],
      }),
      claims: [claim],
      evidenceItems,
      sources: [
        sourceWithUnknownLicense,
        restrictedSource,
        permissionRequiredSource,
      ],
    });

    expect(assessment.sourceReadinessPasses).toBe(true);
    // Source reuse flags remain warnings; absent Charter/manifest metadata
    // still blocks the overall release candidate instead of failing open.
    expect(issueTypes(assessment)).toEqual(
      expect.arrayContaining([
        "corridor_charter_binding_mismatch",
        "release_manifest_binding_mismatch",
      ])
    );
    expect(reviewFlagTypes(assessment)).toEqual(
      expect.arrayContaining([
        "sources_with_unknown_license",
        "sources_restricted",
        "sources_permission_required",
      ])
    );
  });

  it("creates a structural blocker for unresolved right-of-reply posture", () => {
    const claim = claimWith({
      rightOfReplyRequired: true,
      rightOfReplyReason: "Materially affects an identifiable actor.",
      rightOfReplyStatus: "requested",
    });

    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [claim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
    });

    expect(assessment.rightOfReplyPendingClaims).toHaveLength(1);
    expect(issueTypes(assessment)).toContain("right_of_reply_pending");
  });

  it("creates a structural blocker for inconsistent right-of-reply status", () => {
    const claim = claimWith({
      corridorNode: "labor_risk",
      rightOfReplyRequired: false,
      rightOfReplyStatus: "not_required",
    });

    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [claim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
    });

    expect(assessment.rightOfReplyInconsistentClaims).toHaveLength(1);
    expect(issueTypes(assessment)).toContain("right_of_reply_inconsistent");
  });

  it("creates a review flag for explicit missing rightOfReplyReason", () => {
    const claim = claimWith({
      rightOfReplyRequired: true,
      rightOfReplyReason: " ",
      rightOfReplyStatus: "received",
    });

    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [claim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
    });

    expect(assessment.rightOfReplyMissingReasonClaims).toHaveLength(1);
    expect(reviewFlagTypes(assessment)).toContain(
      "right_of_reply_missing_reason"
    );
    expect(issueTypes(assessment)).not.toContain("right_of_reply_inconsistent");
  });

  it("treats received and declined right-of-reply status as structurally satisfied for that layer", () => {
    const receivedClaim = claimWith({
      id: "CLAIM-TEST-RECEIVED",
      rightOfReplyRequired: true,
      rightOfReplyReason: "Materially affects an identifiable actor.",
      rightOfReplyStatus: "received",
      evidenceLinks: [{ evidenceId: "EVID-TEST-RECEIVED", role: "supports" }],
    });
    const declinedClaim = claimWith({
      id: "CLAIM-TEST-DECLINED",
      rightOfReplyRequired: true,
      rightOfReplyReason: "Materially affects an identifiable actor.",
      rightOfReplyStatus: "declined",
      evidenceLinks: [{ evidenceId: "EVID-TEST-DECLINED", role: "supports" }],
    });
    const receivedEvidence = evidenceItemWith({
      id: "EVID-TEST-RECEIVED",
      claimLinks: [{ claimId: "CLAIM-TEST-RECEIVED", role: "supports" }],
    });
    const declinedEvidence = evidenceItemWith({
      id: "EVID-TEST-DECLINED",
      claimLinks: [{ claimId: "CLAIM-TEST-DECLINED", role: "supports" }],
    });

    const assessment = assessReleaseManifestReadiness({
      dossier: dossierWith({
        linkedClaimIds: ["CLAIM-TEST-RECEIVED", "CLAIM-TEST-DECLINED"],
        linkedEvidenceIds: ["EVID-TEST-RECEIVED", "EVID-TEST-DECLINED"],
      }),
      claims: [receivedClaim, declinedClaim],
      evidenceItems: [receivedEvidence, declinedEvidence],
      sources: [baseSource],
    });

    expect(assessment.rightOfReplyPendingClaims).toEqual([]);
    expect(assessment.rightOfReplyInconsistentClaims).toEqual([]);
    expect(issueTypes(assessment)).not.toContain("right_of_reply_pending");
    expect(issueTypes(assessment)).not.toContain("right_of_reply_inconsistent");
  });

  it("includes the internal-only, no-signing, and no-clearance limitation in the publicSafeSummary", () => {
    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [baseClaim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
    });

    expect(assessment.publicSafeSummary).toContain(
      "This is an internal structural readiness check only."
    );
    expect(assessment.publicSafeSummary).toContain(
      "It does not sign a release manifest"
    );
    expect(assessment.publicSafeSummary).toContain("determine legal status");
    expect(assessment.publicSafeSummary).toContain("clear source rights");
    expect(assessment.publicSafeSummary).toContain(
      "determine legal sufficiency"
    );
    expect(assessment.publicSafeSummary).toContain(
      "determine notice adequacy"
    );
    expect(assessment.publicSafeSummary).toContain("determine fairness");
    expect(assessment.publicSafeSummary).toContain("publication approval");
    expect(assessment.publicSafeSummary).toContain(
      "This is a structural map-safety readiness check only."
    );
    expect(assessment.publicSafeSummary).toContain(
      "It does not validate geospatial accuracy"
    );
    expect(assessment.publicSafeSummary).toContain("exposure safety");
    expect(assessment.publicSafeSummary).toContain("rights-holder consent");
    expect(assessment.publicSafeSummary).toContain("ecological sensitivity");
    expect(assessment.publicSafeSummary).toContain("legal adequacy");
  });

  it("does not return internal notes or sensitive location tokens from map-safety inputs", () => {
    const mapSafetyObjectWithInternalFields = {
      ...baseMapSafetyObject,
      internalNotes: "SECRET_INTERNAL_NOTE_SHOULD_NOT_APPEAR",
      sensitiveLocationToken: "SENSITIVE_LOCATION_TOKEN_SHOULD_NOT_APPEAR",
    };

    const assessment = assessReleaseManifestReadiness({
      dossier: baseDossier,
      claims: [baseClaim],
      evidenceItems: [baseEvidenceItem],
      sources: [baseSource],
      mapSafetyObjects: [mapSafetyObjectWithInternalFields],
      mapSafetyReviews: [
        {
          ...baseMapSafetyReview,
          classification: "restricted",
          risksConsidered: ["SENSITIVE_LOCATION_TOKEN_SHOULD_NOT_APPEAR"],
          mitigation: ["SECRET_INTERNAL_NOTE_SHOULD_NOT_APPEAR"],
        },
      ],
    });

    expect(assessment.mapSafetyBlockedObjects).toHaveLength(1);
    expect(JSON.stringify(assessment)).not.toContain(
      "SECRET_INTERNAL_NOTE_SHOULD_NOT_APPEAR"
    );
    expect(JSON.stringify(assessment)).not.toContain(
      "SENSITIVE_LOCATION_TOKEN_SHOULD_NOT_APPEAR"
    );
  });
});
