import type { ReleaseManifest } from "@/types/eeo";

export const releaseManifest: ReleaseManifest = {
  id: "REL-CC-001",
  recordMode: "illustrative",
  title: "Copper-Cobalt corridor public record",
  corridor: "Copper-Cobalt Critical Minerals Corridor",
  corridorCaseId: "CORRIDOR-CU-CO-001",
  corridorCharterId: "CHARTER-CU-CO-001",
  corridorCharterVersion: "0.1-draft",
  crossCuttingLayerAssessmentIds: [
    "LAYER-CU-CO-ENDOWMENT",
    "LAYER-CU-CO-GOVERNANCE",
    "LAYER-CU-CO-HUMAN-DEPENDENCY",
    "LAYER-CU-CO-LABOR-HEALTH",
    "LAYER-CU-CO-OWNERSHIP-FINANCE",
    "LAYER-CU-CO-TRADE-LOGISTICS",
    "LAYER-CU-CO-REVENUE-VALUE",
    "LAYER-CU-CO-ECOLOGY-NEXUS",
    "LAYER-CU-CO-CIRCULARITY-RESTORATION",
    "LAYER-CU-CO-EVIDENCE-REMEDY",
  ],
  releaseDate: "2026-04-27",
  includedClaimIds: ["CLAIM-DRC-CO-001"],
  withheldClaimIds: [
    "CLAIM-DRC-CO-002",
    "CLAIM-DRC-CO-003",
    "CLAIM-DRC-CO-004",
    "CLAIM-DRC-CO-005",
    "CLAIM-DRC-CO-006",
    "CLAIM-DRC-CO-007",
  ],
  unresolvedDisputes: [],
  exposureReviewSummary:
    "The current release includes only one low-exposure methodological claim based on official and multilateral sources. Other visible corridor claims remain outside the current release manifest until method, exposure, source-limit, and right-of-reply posture are reviewed for their claim type. The release does not publish sensitive community data, exact vulnerable-site data, or allegations against specific firms.",
  methodologyVersion: "0.2",
  approvedBy: ["Method review", "Exposure review"],
  publicLimitations: [
    "This record remains illustrative and does not override the provisional Corridor Charter or authorize public corridor release.",
    "Only claims listed under includedClaimIds are in the current release scope.",
    "Claims listed under withheldClaimIds may remain visible as prototype dossier records, but they are not release-approved public findings.",
    "Withheld status records publication discipline; it is not a finding that a claim is false, disputed, unlawful, or unsafe in all forms.",
    "This release does not assert chain-of-custody verification without underlying evidence.",
    "This release does not make legal findings outside cited authorities.",
    "This release does not identify specific products as containing cobalt from specific mines without substantiation.",
    "This release does not publish sensitive community or ecological location data.",
  ],
  mapSafetyRestrictions: [
    "Geographic detail is generalized for public release.",
    "Restricted or do_not_publish map layers are not publicly rendered.",
  ],
  sourceLimitationsSummary: [
    "USGS production and reserve data contextualize mineral scale but do not establish mine-to-product chain-of-custody.",
    "UN Comtrade reported trade flows contextualize cross-border reporting but do not prove product origin or specific shipment responsibility.",
    "Additional claim-specific source limitations must be reviewed before currently withheld claims can enter a release manifest.",
  ],
  rightOfReplySummary:
    "Right-of-reply applies when a claim may materially affect an identifiable institution, company, agency, operator, or contested relationship. Withheld claims require claim-type review for right-of-reply posture before release approval. This is publication discipline, not legal adjudication.",
  evidenceCompletenessSummary:
    "This release includes one fully inspectable methodological claim with linked evidence, linked sources, and explicit source limitations. Six additional visible dossier claims are withheld from the current release scope pending claim-specific review.",
};
