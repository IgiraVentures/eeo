import type { PublicationDecision, ReviewStatus } from "./eeo";
import type { AccessTier, RequiredReview } from "./accessGovernance";

export type ReleaseGateStatus =
  | "not_started"
  | "blocked"
  | "needs_review"
  | "ready"
  | "released"
  | "withdrawn";

export type ReleaseGateObjectType =
  | "corridor_case"
  | "corridor_charter"
  | "corridor_layer_assessment"
  | "claim"
  | "evidence"
  | "source"
  | "dossier_section"
  | "map_layer"
  | "monitoring_signal"
  | "press_material"
  | "release_manifest";

export type ReleaseGateBlockerType =
  | "corridor_charter_missing"
  | "corridor_not_authorized"
  | "corridor_authorization_incomplete"
  | "charter_version_mismatch"
  | "scope_ambiguity"
  | "source_rights_unresolved"
  | "evidence_coverage_insufficient"
  | "mandatory_layer_unassessed"
  | "mandatory_layer_not_ready"
  | "mandatory_layer_blocked"
  | "missing_evidence"
  | "missing_source_limitations"
  | "access_decision_missing"
  | "access_decision_blocks_publication"
  | "map_safety_unresolved"
  | "right_of_reply_unresolved"
  | "correction_unresolved"
  | "claim_governance_unresolved"
  | "language_safety_unresolved"
  | "press_exceeds_release_manifest"
  | "publication_decision_blocks_release"
  | "restricted_data_exposure"
  | "not_collected_source"
  | "human_rights_or_labor_review_required"
  | "community_or_indigenous_review_required"
  | "legal_review_required";

export interface ReleaseGateBlocker {
  type: ReleaseGateBlockerType;
  message: string;
  objectId?: string;
  requiredReview?: RequiredReview;

  /**
   * Safe for public release-manifest summaries if needed.
   * Must not include reviewer notes, sensitive details, private rationale,
   * restricted coordinates, or submitter information.
   */
  publicSafeSummary?: string;
}

export interface ReleaseGateCheck {
  id: string;
  objectType: ReleaseGateObjectType;
  objectId: string;

  status: ReleaseGateStatus;

  publicationDecision?: PublicationDecision;
  reviewStatus?: ReviewStatus;
  accessTier?: AccessTier;

  requiredReviews: RequiredReview[];
  completedReviews: RequiredReview[];

  blockers: ReleaseGateBlocker[];

  publicLimitations: string[];

  /**
   * Internal only. Must not be rendered publicly without review.
   */
  internalNotes?: string;

  checkedAt: string;
  checkedBy: "system_rule" | "reviewer" | "governance_protocol";
}

export interface ReleaseGateAssessment {
  id: string;
  releaseManifestId?: string;
  dossierId?: string;

  status: ReleaseGateStatus;

  checks: ReleaseGateCheck[];

  readyObjectIds: string[];
  blockedObjectIds: string[];
  needsReviewObjectIds: string[];

  publicSummary: string;

  /**
   * Internal only. Must not be rendered publicly without review.
   */
  internalSummary?: string;

  assessedAt: string;
  assessedBy: "system_rule" | "reviewer" | "governance_protocol";
}
