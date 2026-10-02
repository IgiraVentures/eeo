/**
 * v0.9 contract only.
 *
 * Access governance defines whether information should be public, aggregated,
 * internal, restricted, or not collected.
 *
 * This file is type-only. It must not introduce runtime access workflows,
 * dashboards, monitoring feeds, scenario interfaces, or publication automation.
 */

export type AccessTier =
  | "public"
  | "aggregated"
  | "internal"
  | "restricted"
  | "not_collected";

export type AccessDecisionReason =
  | "low_publication_risk"
  | "public_interest"
  | "legal_public_source"
  | "requires_aggregation"
  | "community_or_indigenous_authority"
  | "worker_or_whistleblower_safety"
  | "ecological_sensitivity"
  | "sacred_or_cultural_sensitivity"
  | "national_or_infrastructure_sensitivity"
  | "commercial_or_contractual_sensitivity"
  | "personal_data_minimization"
  | "source_confidentiality"
  | "right_of_reply_required"
  | "map_safety_required"
  | "not_necessary"
  | "do_no_harm";

export type LifecycleStage =
  | "collection"
  | "classification"
  | "storage"
  | "research"
  | "analysis"
  | "review"
  | "publication"
  | "press"
  | "correction"
  | "incident_response"
  | "retention_or_deletion";

export type RequiredReview =
  | "evidence_review"
  | "legal_review"
  | "map_safety_review"
  | "right_of_reply_review"
  | "community_or_indigenous_review"
  | "labor_or_human_rights_review"
  | "ecological_review"
  | "language_safety_review"
  | "press_review"
  | "security_review"
  | "data_protection_review";

export type AccessObjectType =
  | "corridor_case"
  | "corridor_charter"
  | "corridor_layer_assessment"
  | "claim"
  | "evidence"
  | "source"
  | "dossier_section"
  | "monitoring_signal"
  | "map_layer"
  | "correction"
  | "review_note"
  | "community_submission"
  | "indigenous_or_community_knowledge"
  | "labor_or_worker_data"
  | "press_material"
  | "release_manifest";

export type RetentionRule =
  | "retain_public_record"
  | "retain_internal_until_review_complete"
  | "retain_restricted_with_access_log"
  | "delete_after_review"
  | "do_not_store"
  | "community_governed_retention"
  | "legal_hold";

export type AccessDecisionStatus =
  | "draft"
  | "approved"
  | "needs_review"
  | "superseded"
  | "withdrawn";

export interface AccessGovernanceDecision {
  id: string;

  objectType: AccessObjectType;

  /**
   * Optional because “not_collected” decisions should not require storing
   * sensitive object identifiers or detailed descriptions.
   */
  objectId?: string;

  /**
   * Use only a minimal, non-sensitive description.
   * For not_collected decisions, avoid storing the underlying sensitive detail.
   */
  objectDescription?: string;

  accessTier: AccessTier;
  status: AccessDecisionStatus;

  reasons: AccessDecisionReason[];

  publicationAllowed: boolean;
  aggregationRequired: boolean;
  restrictionRequired: boolean;
  collectionProhibited: boolean;

  requiredReviews: RequiredReview[];

  authorityOrConsentBasis?: string;
  jurisdictionalNotes?: string;

  mapSafetyClass?: string;
  exposureRisk?: string;
  publicationDecision?: string;

  retentionRule: RetentionRule;
  reviewBy?: string;

  publicRationale?: string;

  /**
   * Internal rationale must never be shown publicly without review.
   */
  internalRationale?: string;

  decidedAt: string;
  decidedBy: "system_rule" | "reviewer" | "governance_protocol";

  supersedesDecisionId?: string;
}
