export type ConfidenceLevel =
  | "high"
  | "medium"
  | "low"
  | "insufficient"
  | "disputed";

export type EvidenceClass =
  | "official"
  | "observed"
  | "modeled"
  | "inferred"
  | "reported"
  | "alleged"
  | "community_submitted"
  | "restricted";

export type EvidenceRole =
  | "supports"
  | "limits"
  | "contradicts"
  | "contextualizes"
  | "motivates_review";

export type ExposureRisk =
  | "low"
  | "medium"
  | "high"
  | "restricted"
  | "do_not_publish";

export type PublicationDecision =
  | "publish"
  | "publish_aggregated"
  | "publish_with_redactions"
  | "withhold"
  | "do_not_collect";

export type ReviewStatus =
  | "draft"
  | "method_review"
  | "legal_review"
  | "exposure_review"
  | "right_of_reply_pending"
  | "approved_for_release"
  | "challenged"
  | "corrected"
  | "withdrawn";

export type LegalPosture =
  | "factual_observation"
  | "methodological_limit"
  | "risk_indicator"
  | "analytical_inference"
  | "normative_concern"
  | "not_a_legal_finding";

export type ClaimGovernanceStatus =
  | "stable"
  | "challenged"
  | "under_review"
  | "corrected"
  | "restricted"
  | "withdrawn";

export type RecordMode =
  | "synthetic"
  | "illustrative"
  | "governed"
  | "released"
  | "restricted";

export type PublicRecordStatus =
  | "released"
  | "under_review"
  | "corrected"
  | "challenged"
  | "withdrawn"
  | "restricted";

export interface Source {
  id: string;
  recordMode: RecordMode;
  title: string;
  publisher: string;
  url?: string;
  sourceType:
    | "government"
    | "multilateral"
    | "company"
    | "ngo"
    | "academic"
    | "satellite"
    | "community"
    | "media"
    | "other";
  jurisdiction?: string;
  publicationDate?: string;
  accessedDate: string;
  licenseStatus: "open" | "restricted" | "unknown" | "permission_required";
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  recordMode: RecordMode;
  sourceId: string;
  title: string;
  summary: string;
  evidenceClass: EvidenceClass;
  confidenceContribution: ConfidenceLevel;
  limitations: string[];
  exposureRisk: ExposureRisk;
  publicationDecision: PublicationDecision;
  claimLinks: {
    claimId: string;
    role: EvidenceRole;
    note?: string;
  }[];
}

export interface Entity {
  id: string;
  recordMode: RecordMode;
  name: string;
  entityType:
    | "resource"
    | "jurisdiction"
    | "concession"
    | "permit"
    | "operator"
    | "registered_owner"
    | "beneficial_owner"
    | "parent_company"
    | "offtake_buyer"
    | "financier"
    | "processor"
    | "trader"
    | "worker_group"
    | "community"
    | "state_agency"
    | "ecosystem";
  jurisdiction?: string;
  identifiers?: Record<string, string>;
  caveats?: string[];
}

export interface Claim {
  id: string;
  recordMode: RecordMode;
  title: string;
  plainLanguageClaim: string;
  claimType:
    | "descriptive"
    | "relationship"
    | "risk_flag"
    | "gap"
    | "method_limit"
    | "public_benefit_question";
  legalPosture: LegalPosture;
  corridorNode:
    | "endowment"
    | "jurisdiction"
    | "concession_permit"
    | "operator"
    | "ownership_control"
    | "extraction_production"
    | "processing_trade"
    | "labor_risk"
    | "ecological_signal"
    | "public_revenue"
    | "public_benefit"
    | "evidence_gap";
  evidenceLinks: {
    evidenceId: string;
    role: EvidenceRole;
    note?: string;
  }[];
  entityIds: string[];
  confidence: ConfidenceLevel;
  exposureRisk: ExposureRisk;
  publicationDecision: PublicationDecision;
  reviewStatus: ReviewStatus;
  rightOfReplyRequired: boolean;
  rightOfReplyStatus:
    | "not_required"
    | "not_requested"
    | "requested"
    | "received"
    | "declined"
    | "overdue";
  rightOfReplyReason?: string;
  whatThisDoesNotProve: string[];
  whatWouldReviseThisClaim: string[];
  lastUpdated: string;
  lastReviewed: string;
  staleAfter: string;
  governanceStatus?: ClaimGovernanceStatus;
  linkedCorrectionIds?: string[];
  lastGovernanceReviewAt?: string;
  governanceNote?: string;
}

export interface ReleaseManifest {
  id: string;
  recordMode: RecordMode;
  title: string;
  corridor: string;
  corridorCaseId?: string;
  corridorCharterId?: string;
  corridorCharterVersion?: string;
  crossCuttingLayerAssessmentIds?: string[];
  releaseDate?: string;
  includedClaimIds: string[];
  withheldClaimIds: string[];
  unresolvedDisputes: string[];
  exposureReviewSummary: string;
  methodologyVersion: string;
  approvedBy: string[];
  publicLimitations: string[];
  challengedClaimIds?: string[];
  correctedClaimIds?: string[];
  restrictedClaimIds?: string[];
  withdrawnClaimIds?: string[];
  openCorrectionIds?: string[];
  lastCorrectionReviewAt?: string;
  mapSafetyRestrictions?: string[];
  sourceLimitationsSummary?: string[];
  rightOfReplySummary?: string;
  evidenceCompletenessSummary?: string;
}
