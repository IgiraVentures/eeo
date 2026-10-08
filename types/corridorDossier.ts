/**
 * Corridor evidence dossier structure (v0.6) — typing only for the Critical Minerals Corridor pilot.
 * No runtime dossier publishing or temporal/monitoring hooks.
 */

import type { RecordMode } from "@/types/eeo";
import type { EndowmentDomainId } from "@/types/endowmentTaxonomy";

export type CorridorDossierSection =
  | "scope"
  | "source_map"
  | "endowment_profile"
  | "governance_profile"
  | "concession_permit_profile"
  | "operator_profile"
  | "ownership_control_profile"
  | "extraction_production_profile"
  | "processing_trade_profile"
  | "labor_profile"
  | "ecological_profile"
  | "public_revenue_profile"
  | "value_capture_profile"
  | "human_capability_stewardship_profile"
  | "evidence_gaps"
  | "methods_limits"
  | "safeguards_map_safety"
  | "right_of_reply"
  | "release_manifest";

export type DossierSectionStatus =
  | "not_started"
  | "source_mapping"
  | "drafting"
  | "evidence_review"
  | "legal_review"
  | "exposure_review"
  | "partner_review"
  | "ready_for_release"
  | "withheld";

export interface CorridorDossierSectionRecord {
  id: string;
  recordMode: RecordMode;
  section: CorridorDossierSection;
  title: string;
  status: DossierSectionStatus;
  summary: string;
  linkedClaimIds: string[];
  linkedEvidenceIds: string[];
  sourceIds: string[];
  publicLimitations: string[];
  exposureNotes: string[];
  lastUpdated: string;
}

export interface CorridorDossier {
  id: string;
  recordMode: RecordMode;
  title: string;
  /** Structured corridor references. Optional only for legacy prototype records. */
  corridorCaseId?: string;
  corridorCharterId?: string;
  corridorCharterVersion?: string;
  primaryDomainId?: EndowmentDomainId;
  linkedDomainIds?: EndowmentDomainId[];
  crossCuttingLayerAssessmentIds?: string[];
  /** Legacy display label retained during migration. */
  corridor: string;
  geography: string;
  commodityFocus: string[];
  purpose: string;
  scopeStatement: string;
  nonGoals: string[];
  sections: CorridorDossierSectionRecord[];
  releaseReadiness:
    | "not_ready"
    | "internal_review"
    | "partner_review"
    | "release_candidate"
    | "released";
  publicLimitations: string[];
  lastUpdated: string;
}
