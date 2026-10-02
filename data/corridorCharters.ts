import type { CorridorCharter } from "@/types/corridorCharter";
import { COPPER_COBALT_CORRIDOR_CASE_ID } from "./corridorCatalog";

export const COPPER_COBALT_CHARTER_ID = "CHARTER-CU-CO-001";

export const copperCobaltProvisionalCharter: CorridorCharter = {
  id: COPPER_COBALT_CHARTER_ID,
  version: "0.1-draft",
  corridorCaseId: COPPER_COBALT_CORRIDOR_CASE_ID,
  title: "Copper-Cobalt Corridor Charter",
  status: "provisional",
  familyId: "critical-minerals",
  primaryDomainId: "geological_mineral",
  linkedDomainIds: ["energy", "freshwater_cryosphere", "land_soil_food", "biodiversity_ecosystem_functions", "atmosphere_climate_regulation"],
  commodityFocus: ["copper", "cobalt"],
  publicInterestQuestion: "Can EEO connect public and public-safe evidence about copper-cobalt endowment, governance, labor, trade, ownership/control, public revenue, ecological effects, value capture, and unresolved public-benefit questions without exceeding the evidence or exposing vulnerable people and places?",
  intendedUsers: ["communities and rights-holders", "workers and labor institutions", "public agencies and policymakers", "journalists and researchers", "public-interest finance and procurement users"],
  boundary: {
    geographicBoundarySummary: "Current prototype evidence is centered on Democratic Republic of the Congo national-level copper/cobalt context. Site boundaries, rights-holder coverage, and the downstream processing/trade stopping point are not yet authorized.",
    jurisdictions: ["Democratic Republic of the Congo (prototype evidence context only)"],
    rightsHolderScope: ["Specific rights-holder and community scope must be identified and reviewed before authorization."],
    timePeriod: { basis: "Source-specific periods are retained; a corridor-wide analytical period has not yet been approved." },
    upstreamStart: "Endowment and production context; the exact authorized upstream boundary remains under review.",
    downstreamStop: "Downstream processing and trade stopping point remains under review and is not yet authorized.",
    explicitExclusions: ["product-level chain-of-custody verification", "legal adjudication or ownership determination", "precise sensitive community, ecological, infrastructure, or artisanal-mining locations", "composite country, company, project, or community scores", "global atlas expansion"],
    unresolvedBoundaryQuestions: ["Define the exact geographic corridor boundary and whether it is national, subnational, or multi-jurisdictional.", "Define the authorized downstream processing and trade stopping point.", "Define the corridor-wide analytical period.", "Identify relevant rights-holders and community-governance requirements before any site-level publication."],
  },
  sourceInventoryStatus: "partial",
  licenseUseBasisStatus: "partial",
  evidenceCoverageStatus: "partial",
  entityResolutionMethod: "Use source-backed stable identifiers where available; preserve ambiguity and competing records rather than force entity resolution.",
  legalSovereigntyPosture: "EEO documents public records and available evidence while respecting national sovereignty, Indigenous and customary authority, local rights, private law, and competent legal institutions. It makes no legal finding.",
  rightsCommunityConsiderations: ["Community and Indigenous authority must be identified before publishing information that implicates land, knowledge, consent, sacred sites, or localized harm.", "Worker and community evidence must be handled under retaliation, privacy, consent, and disclosure safeguards."],
  exposureRiskAssessment: "Material exposure risk remains for named actors, artisanal-mining locations, community reports, ecological locations, and infrastructure detail. Public release requires aggregation, restriction, right-of-reply, or suppression where indicated.",
  disclosureTierPlan: "Use public, contextual-public, aggregated, verified-access, community-governed, or suppressed handling according to rights, sensitivity, source rights, and foreseeable harm.",
  rightOfReplyTriggers: ["named high-impact operator, company, beneficial-owner, or public-agency risk claims", "unresolved allegations involving severe labor, ecological, corruption, rights, or public-benefit concerns", "contested ownership or control assertions with reputational consequence"],
  correctionWithdrawalProcess: "Use the existing EEO correction route; challenged or unsafe claims may be corrected, restricted, withheld, or withdrawn while preserving public-safe version history.",
  reviewOwnerRoles: ["method reviewer", "evidence steward", "legal posture reviewer", "community or Indigenous safeguards reviewer where applicable", "labor or human-rights reviewer where applicable", "ecological reviewer where applicable", "release authority"],
  authorizationDecision: "pause",
  unresolvedAuthorizationItems: ["Approve the exact geographic and temporal boundary.", "Approve the downstream stopping point.", "Complete source inventory and license/use-basis review.", "Reach sufficient evidence coverage for the bounded public-interest question.", "Identify rights-holder and community review requirements for any localized material.", "Complete mandatory cross-cutting layer assessments."],
  lastUpdated: "2026-09-28T00:00:00.000Z",
};
