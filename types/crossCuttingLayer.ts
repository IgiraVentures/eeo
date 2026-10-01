import type { RequiredReview } from "./accessGovernance";
import type { RecordMode } from "./eeo";

export const MANDATORY_CROSS_CUTTING_LAYER_IDS = [
  "endowment_condition",
  "governance_rights_consent",
  "human_dependency_public_capability",
  "labor_health_human_rights",
  "ownership_finance_control",
  "processing_trade_logistics",
  "public_revenue_value_capture",
  "ecological_integrity_cumulative_nexus",
  "waste_circularity_restoration_future_liability",
  "evidence_disclosure_remedy",
] as const;

export type CorridorCrossCuttingLayerId =
  (typeof MANDATORY_CROSS_CUTTING_LAYER_IDS)[number];

export type CorridorLayerAssessmentStatus =
  | "not_assessed"
  | "scoping"
  | "evidence_review"
  | "safeguards_review"
  | "ready"
  | "blocked"
  | "not_material";

export interface CorridorLayerAssessment {
  id: string;
  recordMode: RecordMode;
  corridorCaseId: string;
  charterId: string;
  charterVersion: string;
  layer: CorridorCrossCuttingLayerId;
  status: CorridorLayerAssessmentStatus;
  materialityRationale: string;
  linkedClaimIds: string[];
  linkedEvidenceIds: string[];
  sourceIds: string[];
  requiredReviews: RequiredReview[];
  blockers: string[];
  publicLimitations: string[];
  lastUpdated: string;
}
