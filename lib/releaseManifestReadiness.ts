import type { CorridorDossier } from "@/types/corridorDossier";
import type { CorridorCharter } from "@/types/corridorCharter";
import type { CorridorLayerAssessment } from "@/types/crossCuttingLayer";
import type { Claim, EvidenceItem, Source } from "@/types/eeo";
import type { MapSafetyClassification, MapSafetyReview } from "@/types/mapSafety";
import { assessCorridorPublicationReadiness } from "@/lib/corridorGovernance";
import { assessDossierReadiness } from "@/lib/dossierReadiness";
import { assessEvidenceIntegrity } from "@/lib/evidenceIntegrity";
import { canRenderPublicMapLayer } from "@/lib/mapSafety";
import { canClaimBeApprovedForRelease } from "@/lib/publicationRules";
import { assessRightOfReplyReadiness } from "@/lib/rightOfReplyReadiness";
import { assessSourceReadiness } from "@/lib/sourceReadiness";

const PUBLIC_SAFE_SUMMARY =
  "This is an internal structural readiness check only. It does not sign a release manifest, approve publication, validate factual truth, determine legal status, clear source rights, determine legal sufficiency, determine notice adequacy, determine fairness, or grant publication approval. This is a structural map-safety readiness check only. It does not validate geospatial accuracy, exposure safety, rights-holder consent, ecological sensitivity, legal adequacy, or publication approval.";

export type ReleaseManifestMapSafetyClassification =
  | MapSafetyClassification
  | "unsafe";

export type ReleaseManifestMapSafetyDisposition =
  | "release_bound"
  | "withheld"
  | "suppressed";

export interface ReleaseManifestMapSafetyObject {
  id: string;
  title: string;
  reviewId?: string;
  disposition?: ReleaseManifestMapSafetyDisposition;
}

export type ReleaseManifestMapSafetyReview = Omit<
  MapSafetyReview,
  "classification"
> & {
  classification: ReleaseManifestMapSafetyClassification;
};

type ReleaseManifestMapSafetyObjectSummary = Pick<
  ReleaseManifestMapSafetyObject,
  "id" | "title"
> & {
  disposition: ReleaseManifestMapSafetyDisposition;
};

type ReleaseManifestMapSafetyBlockedObjectSummary =
  ReleaseManifestMapSafetyObjectSummary & {
    classification: ReleaseManifestMapSafetyClassification;
  };

interface MapSafetyReadinessAssessment {
  passes: boolean;
  missingReviewObjects: ReleaseManifestMapSafetyObjectSummary[];
  blockedObjects: ReleaseManifestMapSafetyBlockedObjectSummary[];
}

export type ReleaseManifestBlockingIssueType =
  | "corridor_charter_binding_mismatch"
  | "corridor_authorization_not_ready"
  | "mandatory_corridor_layers_not_ready"
  | "dossier_release_not_ready"
  | "dossier_sections_incomplete"
  | "dossier_sections_missing_claims"
  | "dossier_sections_missing_evidence"
  | "claims_missing_evidence_links"
  | "claims_reference_missing_evidence"
  | "evidence_references_missing_sources"
  | "evidence_without_claim_links"
  | "reciprocal_link_mismatches"
  | "sources_missing_accessed_date"
  | "right_of_reply_pending"
  | "right_of_reply_inconsistent"
  | "map_safety_review_missing"
  | "map_safety_blocked_classification";

export type ReleaseManifestReviewFlagType =
  | "non_approvable_claims"
  | "claims_with_only_contextual_evidence"
  | "sources_with_unknown_license"
  | "sources_permission_required"
  | "sources_restricted"
  | "sources_unused_by_evidence"
  | "right_of_reply_missing_reason";

export interface ReleaseManifestReadinessItem<TType extends string> {
  type: TType;
  count: number;
  publicSafeSummary: string;
}

export interface ReleaseManifestReadinessAssessment {
  releaseReadiness: CorridorDossier["releaseReadiness"];
  totalClaims: number;
  approvableClaims: number;
  nonApprovableClaims: number;
  corridorCharterBindingPasses: boolean;
  corridorAuthorizationPasses: boolean;
  corridorAuthorizationBlockerCount: number;
  corridorLayerReadinessPasses: boolean;
  corridorLayerBlockerCount: number;
  dossierReady: boolean;
  evidenceIntegrityPasses: boolean;
  sourceReadinessPasses: boolean;
  mapSafetyReadinessPasses: boolean;
  mapSafetyMissingReviewObjects: ReleaseManifestMapSafetyObjectSummary[];
  mapSafetyBlockedObjects: ReleaseManifestMapSafetyBlockedObjectSummary[];
  rightOfReplyPendingClaims: ReturnType<
    typeof assessRightOfReplyReadiness
  >["claimsPending"];
  rightOfReplyInconsistentClaims: ReturnType<
    typeof assessRightOfReplyReadiness
  >["claimsWithInconsistentStatus"];
  rightOfReplyMissingReasonClaims: ReturnType<
    typeof assessRightOfReplyReadiness
  >["claimsMissingReason"];
  blockingStructuralIssues: ReleaseManifestReadinessItem<ReleaseManifestBlockingIssueType>[];
  reviewFlags: ReleaseManifestReadinessItem<ReleaseManifestReviewFlagType>[];
  publicSafeSummary: string;
}

export function assessReleaseManifestReadiness(params: {
  dossier: CorridorDossier;
  claims: Claim[];
  evidenceItems: EvidenceItem[];
  sources: Source[];
  corridorCharter?: CorridorCharter;
  corridorLayerAssessments?: CorridorLayerAssessment[];
  mapSafetyObjects?: ReleaseManifestMapSafetyObject[];
  mapSafetyReviews?: ReleaseManifestMapSafetyReview[];
}): ReleaseManifestReadinessAssessment {
  const dossierReadiness = assessDossierReadiness(params.dossier);
  const usesStructuredCorridorGovernance = Boolean(
    params.dossier.corridorCaseId ||
      params.dossier.corridorCharterId ||
      params.dossier.corridorCharterVersion
  );
  const corridorReadiness = usesStructuredCorridorGovernance
    ? assessCorridorPublicationReadiness({
        charter: params.corridorCharter,
        assessments: params.corridorLayerAssessments ?? [],
      })
    : { ready: true, blockers: [] };

  const corridorCharterBindingPasses =
    !usesStructuredCorridorGovernance ||
    Boolean(
      params.corridorCharter &&
        params.dossier.corridorCaseId === params.corridorCharter.corridorCaseId &&
        params.dossier.corridorCharterId === params.corridorCharter.id &&
        params.dossier.corridorCharterVersion === params.corridorCharter.version
    );

  const layerBlockerTypes = new Set([
    "charter_version_mismatch",
    "mandatory_layer_unassessed",
    "mandatory_layer_not_ready",
    "mandatory_layer_blocked",
  ]);
  const corridorLayerBlockerCount = corridorReadiness.blockers.filter((blocker) =>
    layerBlockerTypes.has(blocker.type)
  ).length;
  const corridorAuthorizationBlockerCount =
    corridorReadiness.blockers.length - corridorLayerBlockerCount;
  const corridorAuthorizationPasses =
    corridorCharterBindingPasses &&
    corridorAuthorizationBlockerCount === 0;
  const corridorLayerReadinessPasses = corridorLayerBlockerCount === 0;

  const evidenceIntegrity = assessEvidenceIntegrity({
    claims: params.claims,
    evidenceItems: params.evidenceItems,
    sources: params.sources,
  });
  const sourceReadiness = assessSourceReadiness({
    sources: params.sources,
    evidenceItems: params.evidenceItems,
  });
  const rightOfReplyReadiness = assessRightOfReplyReadiness(params.claims);
  const mapSafetyReadiness = assessMapSafetyReadiness({
    mapSafetyObjects: params.mapSafetyObjects ?? [],
    mapSafetyReviews: params.mapSafetyReviews ?? [],
  });

  const approvableClaims = params.claims.filter(
    canClaimBeApprovedForRelease
  ).length;
  const nonApprovableClaims = params.claims.length - approvableClaims;

  const dossierReleaseStageReady =
    params.dossier.releaseReadiness === "release_candidate" ||
    params.dossier.releaseReadiness === "released";
  const incompleteDossierSections =
    dossierReadiness.notStartedSections +
    dossierReadiness.inProgressSections +
    dossierReadiness.blockedOrWithheldSections;
  const dossierReady =
    dossierReleaseStageReady &&
    incompleteDossierSections === 0 &&
    dossierReadiness.sectionsMissingClaims.length === 0 &&
    dossierReadiness.sectionsMissingEvidence.length === 0;

  const evidenceIntegrityPasses =
    evidenceIntegrity.claimsMissingEvidenceLinks.length === 0 &&
    evidenceIntegrity.claimsWithMissingEvidenceItems.length === 0 &&
    evidenceIntegrity.evidenceItemsMissingSources.length === 0 &&
    evidenceIntegrity.evidenceItemsWithNoClaimLinks.length === 0 &&
    evidenceIntegrity.reciprocalLinkMismatches.length === 0;

  const sourceReadinessPasses =
    sourceReadiness.sourcesMissingAccessedDate.length === 0 &&
    sourceReadiness.evidenceUsingMissingSources.length === 0;
  const rightOfReplyStatusInconsistencies =
    rightOfReplyReadiness.claimsWithInconsistentStatus.filter(
      (claim) => claim.issue !== "marked_required_missing_reason"
    );

  const blockingStructuralIssues: ReleaseManifestReadinessAssessment["blockingStructuralIssues"] =
    [];
  const reviewFlags: ReleaseManifestReadinessAssessment["reviewFlags"] = [];

  addReadinessItem(
    blockingStructuralIssues,
    "corridor_charter_binding_mismatch",
    corridorCharterBindingPasses ? 0 : 1,
    "The dossier is not bound to the Corridor Charter version supplied for release review."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "corridor_authorization_not_ready",
    corridorAuthorizationBlockerCount,
    "The Corridor Charter remains missing, unauthorized, incomplete, or insufficiently bounded for public release."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "mandatory_corridor_layers_not_ready",
    corridorLayerBlockerCount,
    "One or more mandatory cross-cutting corridor layers remain unassessed, stale against the Charter version, blocked, or under review."
  );

  addReadinessItem(
    blockingStructuralIssues,
    "dossier_release_not_ready",
    dossierReleaseStageReady ? 0 : 1,
    "Dossier release readiness is not at release-candidate posture."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "dossier_sections_incomplete",
    incompleteDossierSections,
    "One or more dossier sections remain incomplete, under review, or withheld."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "dossier_sections_missing_claims",
    dossierReadiness.sectionsMissingClaims.length,
    "One or more dossier sections have no linked claims."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "dossier_sections_missing_evidence",
    dossierReadiness.sectionsMissingEvidence.length,
    "One or more dossier sections have no linked evidence."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "claims_missing_evidence_links",
    evidenceIntegrity.claimsMissingEvidenceLinks.length,
    "One or more claims have no linked evidence."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "claims_reference_missing_evidence",
    evidenceIntegrity.claimsWithMissingEvidenceItems.length,
    "One or more claims reference evidence records that are not present."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "evidence_references_missing_sources",
    evidenceIntegrity.evidenceItemsMissingSources.length,
    "One or more evidence records reference source records that are not present."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "evidence_without_claim_links",
    evidenceIntegrity.evidenceItemsWithNoClaimLinks.length,
    "One or more evidence records have no claim links."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "reciprocal_link_mismatches",
    evidenceIntegrity.reciprocalLinkMismatches.length,
    "One or more claim/evidence reciprocal links do not match structurally."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "sources_missing_accessed_date",
    sourceReadiness.sourcesMissingAccessedDate.length,
    "One or more source records are missing an accessed date."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "right_of_reply_pending",
    rightOfReplyReadiness.claimsPending.length,
    "One or more claims have unresolved right-of-reply posture."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "right_of_reply_inconsistent",
    rightOfReplyStatusInconsistencies.length,
    "One or more claims have inconsistent right-of-reply status."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "map_safety_review_missing",
    mapSafetyReadiness.missingReviewObjects.length,
    "One or more release-bound map or geospatial objects are missing map-safety review."
  );
  addReadinessItem(
    blockingStructuralIssues,
    "map_safety_blocked_classification",
    mapSafetyReadiness.blockedObjects.length,
    "One or more release-bound map or geospatial objects have blocked map-safety classification."
  );

  addReadinessItem(
    reviewFlags,
    "non_approvable_claims",
    nonApprovableClaims,
    "One or more claims do not currently meet the local release-approval helper conditions."
  );
  addReadinessItem(
    reviewFlags,
    "claims_with_only_contextual_evidence",
    evidenceIntegrity.claimsWithOnlyContextualEvidence.length,
    "One or more claims have only contextual evidence links."
  );
  addReadinessItem(
    reviewFlags,
    "sources_with_unknown_license",
    sourceReadiness.sourcesWithUnknownLicense.length,
    "One or more source records have unknown license posture and need review."
  );
  addReadinessItem(
    reviewFlags,
    "sources_permission_required",
    sourceReadiness.sourcesPermissionRequired.length,
    "One or more source records are marked permission-required and need review."
  );
  addReadinessItem(
    reviewFlags,
    "sources_restricted",
    sourceReadiness.sourcesRestricted.length,
    "One or more source records are marked restricted and need review."
  );
  addReadinessItem(
    reviewFlags,
    "sources_unused_by_evidence",
    sourceReadiness.sourcesUnusedByEvidence.length,
    "One or more source records are not linked from current evidence records."
  );
  addReadinessItem(
    reviewFlags,
    "right_of_reply_missing_reason",
    rightOfReplyReadiness.claimsMissingReason.length,
    "One or more explicitly required right-of-reply records are missing a structural reason."
  );

  return {
    releaseReadiness: params.dossier.releaseReadiness,
    totalClaims: params.claims.length,
    approvableClaims,
    nonApprovableClaims,
    corridorCharterBindingPasses,
    corridorAuthorizationPasses,
    corridorAuthorizationBlockerCount,
    corridorLayerReadinessPasses,
    corridorLayerBlockerCount,
    dossierReady,
    evidenceIntegrityPasses,
    sourceReadinessPasses,
    mapSafetyReadinessPasses: mapSafetyReadiness.passes,
    mapSafetyMissingReviewObjects: mapSafetyReadiness.missingReviewObjects,
    mapSafetyBlockedObjects: mapSafetyReadiness.blockedObjects,
    rightOfReplyPendingClaims: rightOfReplyReadiness.claimsPending,
    rightOfReplyInconsistentClaims: rightOfReplyStatusInconsistencies,
    rightOfReplyMissingReasonClaims: rightOfReplyReadiness.claimsMissingReason,
    blockingStructuralIssues,
    reviewFlags,
    publicSafeSummary: PUBLIC_SAFE_SUMMARY,
  };
}

function assessMapSafetyReadiness(params: {
  mapSafetyObjects: ReleaseManifestMapSafetyObject[];
  mapSafetyReviews: ReleaseManifestMapSafetyReview[];
}): MapSafetyReadinessAssessment {
  const reviewsById = new Map(
    params.mapSafetyReviews.map((review) => [review.id, review])
  );
  const missingReviewObjects: ReleaseManifestMapSafetyObjectSummary[] = [];
  const blockedObjects: ReleaseManifestMapSafetyBlockedObjectSummary[] = [];

  for (const mapSafetyObject of params.mapSafetyObjects) {
    const summary = toMapSafetyObjectSummary(mapSafetyObject);

    if (!isReleaseBoundMapSafetyObject(summary)) {
      continue;
    }

    const review = mapSafetyObject.reviewId
      ? reviewsById.get(mapSafetyObject.reviewId)
      : undefined;

    if (!review) {
      missingReviewObjects.push(summary);
      continue;
    }

    if (isBlockedMapSafetyClassification(review.classification)) {
      blockedObjects.push({
        ...summary,
        classification: review.classification,
      });
    }
  }

  return {
    passes: missingReviewObjects.length === 0 && blockedObjects.length === 0,
    missingReviewObjects,
    blockedObjects,
  };
}

function toMapSafetyObjectSummary(
  mapSafetyObject: ReleaseManifestMapSafetyObject
): ReleaseManifestMapSafetyObjectSummary {
  return {
    id: mapSafetyObject.id,
    title: mapSafetyObject.title,
    disposition: mapSafetyObject.disposition ?? "release_bound",
  };
}

function isReleaseBoundMapSafetyObject(
  mapSafetyObject: ReleaseManifestMapSafetyObjectSummary
): boolean {
  return mapSafetyObject.disposition === "release_bound";
}

function isBlockedMapSafetyClassification(
  classification: ReleaseManifestMapSafetyClassification
): boolean {
  if (classification === "unsafe") {
    return true;
  }

  if (
    classification === "delayed_release" ||
    classification === "metadata_only" ||
    classification === "restricted" ||
    classification === "do_not_collect" ||
    classification === "do_not_publish"
  ) {
    return true;
  }

  return classification !== "blurred" && !canRenderPublicMapLayer(classification);
}

function addReadinessItem<TType extends string>(
  items: ReleaseManifestReadinessItem<TType>[],
  type: TType,
  count: number,
  publicSafeSummary: string
): void {
  if (count === 0) {
    return;
  }

  items.push({
    type,
    count,
    publicSafeSummary,
  });
}
