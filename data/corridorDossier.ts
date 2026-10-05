import type {
  CorridorDossier,
  CorridorDossierSectionRecord,
} from "@/types/corridorDossier";

const V07_UPDATED = "2026-05-26T00:00:00.000Z";

const sectionSeeds: Omit<CorridorDossierSectionRecord, "recordMode">[] = [
  // ── Scope ──────────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-scope",
    section: "scope",
    title: "Scope and corridor framing",
    status: "drafting",
    summary:
      "This section documents the public scope of one copper-cobalt critical-minerals corridor dossier. It depends on the source-map and evidence-ledger layers to keep claims traceable, qualified, reviewable, and correctable. It remains uncertain where later evidence can safely support concession, operator, ownership/control, ecological, or capability narratives. The dossier does not verify supply-chain custody, make legal findings, compare actors through composite indicators, or publish sensitive geospatial detail.",
    linkedClaimIds: [],
    linkedEvidenceIds: [],
    sourceIds: ["SM-USGS-MM", "SM-UNCOMTRADE"],
    publicLimitations: [
      "Scope is corridor-specific. Claims are limited to public or public-safe evidence available for the corridor at this stage.",
      "Temporal profiling, monitoring signals, and scenario analysis are deferred milestones.",
      "Correction and right-of-reply routes govern any claim that could materially affect identifiable actors.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Source map ──────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-source_map",
    section: "source_map",
    title: "Source map & non-duplication",
    status: "source_mapping",
    summary:
      "This section documents which public source domains the dossier depends on, how those sources are used, and where EEO defers to source hosts instead of duplicating them. It depends on the source-map layer, the evidence ledger, and recorded source/license posture. Coverage remains incomplete for contract repositories, beneficial ownership disclosures, ecological overlays, and public-revenue tables. Source inclusion supports public-interest inquiry; it does not determine source quality, legal adequacy, or reuse rights.",
    linkedClaimIds: [
      "CLAIM-DRC-CO-001",
      "CLAIM-DRC-CO-002",
      "CLAIM-DRC-CO-003",
      "CLAIM-DRC-CO-004",
      "CLAIM-DRC-CO-005",
      "CLAIM-DRC-CO-006",
      "CLAIM-DRC-CO-007",
    ],
    linkedEvidenceIds: [
      "EVID-USGS-CO-001",
      "EVID-UNCOMTRADE-CO-001",
      "EVID-USGS-CO-002",
      "EVID-EITI-DRC-001",
      "EVID-USGS-ASM-001",
      "EVID-ILOSTAT-DRC-001",
      "EVID-UNICEF-ASM-001",
      "EVID-AMNESTY-CO-001",
      "EVID-EITI-DRC-002",
      "EVID-OPENOWNERSHIP-DRC-001",
    ],
    sourceIds: [
      "SM-USGS-MM",
      "SM-EITI",
      "SM-RESOURCE-CONTRACTS",
      "SM-OPEN-OWNERSHIP",
      "SM-UNCOMTRADE",
      "SM-ILOSTAT",
      "SM-ECOLOGY-GLOBAL",
      "SM-GFW",
      "SM-PUBLIC-REVENUE-EITI-IMF",
      "SM-UNDRIP-HR",
      "SM-CARE-GIS",
    ],
    publicLimitations: [
      "Source mapping is structural and contextual. It does not approve legal reuse, validate source quality, or create a complete source inventory.",
      "Restricted, permission-based, or sensitive source materials remain outside public dossier output.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Endowment ───────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-endowment_profile",
    section: "endowment_profile",
    title: "Endowment profile",
    status: "evidence_review",
    summary:
      "This section documents available evidence about cobalt endowment context for the corridor, with USGS reserve data as the current evidence layer. It supports public-interest inquiry into how a non-regenerative mineral endowment enters economic life, but reserve concentration does not determine extraction conditions, social outcomes, public benefit, or chain-of-custody. Deeper geological characterization, recovery assumptions, and intergenerational liability framing remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-002"],
    linkedEvidenceIds: ["EVID-USGS-CO-002"],
    sourceIds: ["SRC-USGS-CO-001"],
    publicLimitations: [
      "Reserve data reflects USGS reported figures; independent validation is not performed by EEO.",
      "This section does not assess the recoverable fraction, extraction timeline, or intergenerational endowment liability.",
      "No sensitive geological coordinates or site-level reserve locations are published.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Governance profile ───────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-governance_profile",
    section: "governance_profile",
    title: "Governance profile",
    status: "evidence_review",
    summary:
      "This section documents available governance context for the corridor using EITI and public-law source layers. It describes overlapping governance regimes and transparency obligations as public-record context, not as a finding that rules are enforced, sufficient, or consent-based in any specific place. Concession-level governance, customary authority, community consent, and actor-specific right-of-reply workflows remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-003"],
    linkedEvidenceIds: ["EVID-EITI-DRC-001"],
    sourceIds: ["SRC-EITI-DRC-001"],
    publicLimitations: [
      "Governance framework description does not assess enforcement effectiveness at specific sites.",
      "Community and Indigenous governance rights are not yet characterised in this section.",
      "If future claims materially affect identifiable public authorities, firms, or communities, correction and right-of-reply pathways must be attached before release.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Concession / permit ─────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-concession_permit_profile",
    section: "concession_permit_profile",
    title: "Concession / permit profile",
    status: "source_mapping",
    summary:
      "This section documents the evidence posture needed to describe concession and permit context without reproducing host registries or implying complete legal interpretation. It depends on EITI disclosures, public contract/concession repositories where available, and source-map non-duplication rules. The dossier does not currently publish concession boundaries, permit tables, named site assertions, or legal conclusions. Those elements remain deferred until source licensing, map-safety, legal-context, and right-of-reply posture are complete.",
    linkedClaimIds: ["CLAIM-DRC-CO-003", "CLAIM-DRC-CO-007"],
    linkedEvidenceIds: ["EVID-EITI-DRC-001", "EVID-OPENOWNERSHIP-DRC-001"],
    sourceIds: ["SM-EITI", "SM-RESOURCE-CONTRACTS", "SM-HOST-FIRST-REGISTRIES"],
    publicLimitations: [
      "Public contract or concession absence is not evidence that no instrument exists.",
      "This section does not interpret concession validity, compliance, consent, or rights-holder status.",
      "No precise concession geometry or sensitive infrastructure location is published in this dossier.",
    ],
    exposureNotes: [
      "Named concession and permit records can materially affect identifiable actors and require legal, exposure, map-safety, correction, and right-of-reply review before public release.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Operator profile ─────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-operator_profile",
    section: "operator_profile",
    title: "Operator profile",
    status: "exposure_review",
    summary:
      "This section documents the review posture for any future operator narrative. The current public dossier does not name operators or assign responsibility. It depends on public filings, concession records, source limitations, and right-of-reply review before any actor-affecting claim can be released. Operator-level evidence remains deferred because public records may be incomplete, stale, disputed, or unsafe to summarize without exposure and legal-context review.",
    linkedClaimIds: ["CLAIM-DRC-CO-003", "CLAIM-DRC-CO-007"],
    linkedEvidenceIds: ["EVID-EITI-DRC-001", "EVID-OPENOWNERSHIP-DRC-001"],
    sourceIds: ["SM-EITI", "SM-RESOURCE-CONTRACTS", "SM-OPEN-OWNERSHIP"],
    publicLimitations: [
      "No named operator allegation is made in this dossier.",
      "Operator identity, conduct, or control claims require reciprocal evidence links, exposure review, correction route, and right-of-reply posture.",
      "Public records may describe formal roles without establishing actual operational control or responsibility.",
    ],
    exposureNotes: [
      "Operator narratives are withheld from public detail until actor-affecting review and right-of-reply posture are complete.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Ownership / control ──────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-ownership_control_profile",
    section: "ownership_control_profile",
    title: "Ownership / control profile",
    status: "exposure_review",
    summary:
      "This section documents beneficial-ownership and control visibility as a transparency question, not as a complete ownership register or a finding against any actor. It depends on Open Ownership-style data, public corporate disclosures, concession records, and source-map limits. The current public dossier identifies a disclosure gap only. Named ownership chains, control conclusions, and actor-level narratives remain deferred until evidence, entity-resolution, exposure, legal-context, correction, and right-of-reply review are complete.",
    linkedClaimIds: ["CLAIM-DRC-CO-007"],
    linkedEvidenceIds: ["EVID-OPENOWNERSHIP-DRC-001"],
    sourceIds: ["SM-OPEN-OWNERSHIP", "SM-RESOURCE-CONTRACTS", "SM-HOST-FIRST-REGISTRIES"],
    publicLimitations: [
      "Incomplete public ownership disclosure does not establish improper ownership, non-compliance, or control by any specific actor.",
      "This section does not publish beneficial-owner tables, inferred control chains, or private actor contact data.",
      "Actor-affecting ownership claims require correction and right-of-reply pathways before release.",
    ],
    exposureNotes: [
      "Ownership/control material has reputational and privacy exposure risk and remains limited to transparency-gap framing in this dossier.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Extraction / production ───────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-extraction_production_profile",
    section: "extraction_production_profile",
    title: "Extraction / production profile",
    status: "evidence_review",
    summary:
      "This section documents available production context and method limits for formal and artisanal cobalt production. It depends on USGS production/reserve data and ASM notes. The public dossier raises accountability questions about disaggregation and measurement gaps, but it does not identify sites, operators, workers, or concession-level output. Site-level production profiles, formal/informal disaggregation, and ecological footprint analysis remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-004"],
    linkedEvidenceIds: ["EVID-USGS-ASM-001", "EVID-USGS-CO-001"],
    sourceIds: ["SRC-USGS-CO-001"],
    publicLimitations: [
      "Production data reflects national aggregates; ASM share is not reliably disaggregated.",
      "Claim CLAIM-DRC-CO-004 is under method review and not yet in the public release manifest.",
      "Extraction data is contextual and does not establish labour conditions, ecological causation, or custody links for any specific site.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Processing / trade ────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-processing_trade_profile",
    section: "processing_trade_profile",
    title: "Processing / trade profile",
    status: "evidence_review",
    summary:
      "This section documents how reported production and trade data can contextualize corridor movement without becoming chain-of-custody proof. It depends on USGS and UN Comtrade evidence layers. Trade data is contextual, not chain-of-custody proof, and does not verify origin for a product, shipment, buyer, or downstream facility. Downstream processing pathways, value-add nodes, and mirror-statistics reconciliation remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-001"],
    linkedEvidenceIds: ["EVID-USGS-CO-001", "EVID-UNCOMTRADE-CO-001"],
    sourceIds: ["SM-USGS-MM", "SM-UNCOMTRADE"],
    publicLimitations: [
      "Reported trade data is contextual and does not establish physical chain-of-custody or product origin.",
      "Processing intermediaries are not characterised at this stage.",
      "Actor-affecting trade claims require public-safe evidence, correction route, and right-of-reply posture before release.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Labour risk ───────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-labor_profile",
    section: "labor_profile",
    title: "Labour risk profile",
    status: "exposure_review",
    summary:
      "This section documents available public labour-risk evidence for artisanal cobalt mining, using UNICEF, Amnesty International, and ILO/ILOSTAT layers. It raises accountability questions about child labour, hazardous conditions, informality, and remedy access while avoiding site, worker, or operator identification. The linked risk-flag claim remains under exposure review and does not make legal findings. Formal-sector conditions, current site-level status, and remediation outcomes remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-005"],
    linkedEvidenceIds: ["EVID-ILOSTAT-DRC-001", "EVID-UNICEF-ASM-001", "EVID-AMNESTY-CO-001"],
    sourceIds: ["SRC-ILOSTAT-001", "SRC-UNICEF-ASM-001", "SRC-AMNESTY-COBALT-001"],
    publicLimitations: [
      "Claim CLAIM-DRC-CO-005 is under exposure review; publication posture is publish_with_redactions pending review completion.",
      "Labour risk documentation covers artisanal mining; formal sector conditions are separately governed.",
      "Findings are documented risks and normative concerns, not legal determinations.",
      "Right-of-reply review is required before any future actor-affecting labour claim is released.",
    ],
    exposureNotes: [
      "Labour risk claims carry medium exposure risk due to sensitivity of child labour documentation. Exposure review required before public release.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Ecological signal ─────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-ecological_profile",
    section: "ecological_profile",
    title: "Ecological profile",
    status: "exposure_review",
    summary:
      "This section documents the ecological evidence posture for the corridor and the safeguards that govern any future spatial or environmental narrative. It depends on aggregated ecological source domains, map-safety review, and public-safe production context rather than live monitoring or precise coordinates. The dossier does not currently publish site-level ecological findings, causation claims, sensitive habitat locations, or watershed-specific assertions. Ecological pressure signals remain deferred until source licensing, aggregation, map-safety, and exposure review are complete.",
    linkedClaimIds: ["CLAIM-DRC-CO-004"],
    linkedEvidenceIds: ["EVID-USGS-CO-001", "EVID-USGS-ASM-001"],
    sourceIds: ["SM-ECOLOGY-GLOBAL", "SM-GFW", "SM-CARE-GIS"],
    publicLimitations: [
      "Spatial proximity does not establish ecological causation.",
      "No sensitive ecological coordinates, sacred sites, vulnerable habitat locations, or live map layers are published.",
      "Ecological signals are contextual until public-safe aggregated evidence is linked and reviewed.",
    ],
    exposureNotes: [
      "Ecological and geospatial layers require map-safety review before any public release beyond generalized or aggregated posture.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Public revenue ────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-public_revenue_profile",
    section: "public_revenue_profile",
    title: "Public revenue profile",
    status: "evidence_review",
    summary:
      "This section documents available public-revenue context. It depends on EITI reporting and source limitations. It frames disclosed royalties, taxes, and reconciliation gaps as public-interest questions about transparency and capability, not as findings of wrongdoing or public benefit. Public revenue is a question, not proof of public benefit. Benefit distribution, community revenue sharing, budget use, and fiscal impact on public services remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-006"],
    linkedEvidenceIds: ["EVID-EITI-DRC-002"],
    sourceIds: ["SRC-EITI-DRC-001"],
    publicLimitations: [
      "Claim CLAIM-DRC-CO-006 is under method review and not yet in the public release manifest.",
      "Disclosed revenue is contextual and does not establish durable public benefit.",
      "EITI coverage excludes non-participating operators.",
      "Actor-affecting revenue claims require evidence review, correction path, and right-of-reply posture before release.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Value capture ─────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-value_capture_profile",
    section: "value_capture_profile",
    title: "Value capture profile",
    status: "drafting",
    summary:
      "This section documents the corridor value-capture question: how a non-regenerative mineral endowment may move through extraction, processing, trade, public revenue, and public-benefit pathways. It depends on trade, production, and revenue evidence layers, with explicit method limits. The dossier does not model profit, assign rents to named actors, or infer downstream custody. Processing margins, fiscal retention, community benefit, and public-service conversion remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-001", "CLAIM-DRC-CO-006"],
    linkedEvidenceIds: ["EVID-USGS-CO-001", "EVID-UNCOMTRADE-CO-001", "EVID-EITI-DRC-002"],
    sourceIds: ["SM-USGS-MM", "SM-UNCOMTRADE", "SM-PUBLIC-REVENUE-EITI-IMF"],
    publicLimitations: [
      "Value-capture framing supports inquiry; it is not a revenue model, custody finding, actor attribution, or comparative index.",
      "Trade and public-revenue records are contextual and incomplete for public-benefit analysis.",
      "Future actor-specific value-capture claims require right-of-reply and correction pathways.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Human capability & stewardship ───────────────────────────────────────────
  {
    id: "CDS-CU-CO-human_capability_stewardship_profile",
    section: "human_capability_stewardship_profile",
    title: "Human capability & stewardship profile",
    status: "drafting",
    summary:
      "This section documents the public-benefit and stewardship question raised by the corridor: whether documented endowment transformation is connected to durable capability, remedy, safer work, ecological care, and public services. It depends on labour-risk, public-revenue, governance, and safeguards evidence layers. The current dossier does not measure wellbeing outcomes, establish remediation, or state that revenue has become public benefit. Community-level capability evidence, stewardship agreements, remedy outcomes, and consent-governed knowledge remain deferred.",
    linkedClaimIds: ["CLAIM-DRC-CO-003", "CLAIM-DRC-CO-005", "CLAIM-DRC-CO-006"],
    linkedEvidenceIds: [
      "EVID-EITI-DRC-001",
      "EVID-ILOSTAT-DRC-001",
      "EVID-UNICEF-ASM-001",
      "EVID-AMNESTY-CO-001",
      "EVID-EITI-DRC-002",
    ],
    sourceIds: ["SM-EITI", "SM-ILOSTAT", "SM-UNDRIP-HR", "SM-CARE-GIS", "SM-PUBLIC-REVENUE-EITI-IMF"],
    publicLimitations: [
      "Public revenue, labour-risk, and governance context do not establish durable public capability or remediation.",
      "Consent-governed community knowledge, sensitive testimony, and private remedy materials are not published.",
      "Actor-affecting stewardship claims require public-safe evidence, correction path, and right-of-reply posture.",
    ],
    exposureNotes: [
      "Human capability and stewardship material can implicate vulnerable communities, workers, and rights-holder knowledge; public text remains aggregated and cautious.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Evidence gaps ─────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-evidence_gaps",
    section: "evidence_gaps",
    title: "Evidence gaps",
    status: "source_mapping",
    summary:
      "This section documents known public-evidence gaps that limit corridor accountability analysis. It depends on the evidence-gap claim layer, source-map limits, and correction requests that may add or challenge sources. The current linked claim concerns beneficial ownership disclosure coverage; additional gaps include site-level production data, safe concession-boundary publication posture, community benefit arrangements, ecological monitoring data, formal supply-chain linkages, and budget-use evidence. Evidence gaps support public-interest inquiry and correction requests; they are not findings of wrongdoing.",
    linkedClaimIds: ["CLAIM-DRC-CO-007"],
    linkedEvidenceIds: ["EVID-OPENOWNERSHIP-DRC-001"],
    sourceIds: ["SRC-OPENOWNERSHIP-001"],
    publicLimitations: [
      "Evidence gap documentation is itself incomplete at this stage.",
      "Not all gaps can be safely enumerated without risking disclosure of restricted information.",
      "Gap records should invite corrections, source updates, and right-of-reply where actor-affecting claims arise.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Methods & limits ──────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-methods_limits",
    section: "methods_limits",
    title: "Methods & limits",
    status: "drafting",
    summary:
      "This section documents the dossier method: claim-first drafting, evidence-role labeling, source-limit recording, public-safe disclosure, correction readiness, and release-manifest discipline. It depends on the claim ledger, evidence ledger, source map, publication rules, and release-readiness helpers. The method does not validate factual truth, determine legal status, clear source rights, approve publication, or activate monitoring. Temporal profiling, live ingestion, and scenario analysis remain deferred.",
    linkedClaimIds: [
      "CLAIM-DRC-CO-001",
      "CLAIM-DRC-CO-002",
      "CLAIM-DRC-CO-003",
      "CLAIM-DRC-CO-004",
      "CLAIM-DRC-CO-005",
      "CLAIM-DRC-CO-006",
      "CLAIM-DRC-CO-007",
    ],
    linkedEvidenceIds: [
      "EVID-USGS-CO-001",
      "EVID-UNCOMTRADE-CO-001",
      "EVID-USGS-CO-002",
      "EVID-EITI-DRC-001",
      "EVID-USGS-ASM-001",
      "EVID-ILOSTAT-DRC-001",
      "EVID-UNICEF-ASM-001",
      "EVID-AMNESTY-CO-001",
      "EVID-EITI-DRC-002",
      "EVID-OPENOWNERSHIP-DRC-001",
    ],
    sourceIds: ["SM-EVIDENCE-LEDGER-WIRING", "SM-OECD-MINERALS", "SM-CARE-GIS"],
    publicLimitations: [
      "Methods describe evidence discipline and safeguards; they do not create legal findings, source clearance, or publication approval.",
      "Trade data is contextual, not chain-of-custody proof.",
      "Public revenue is a question, not proof of public benefit.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },

  // ── Safeguards & map safety ────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-safeguards_map_safety",
    section: "safeguards_map_safety",
    title: "Safeguards & map safety",
    status: "exposure_review",
    summary:
      "This section documents disclosure and map-safety posture for the public dossier. It depends on the safeguards source-map layer, map-safety protocol, exposure review, and correction governance. The dossier uses generalized or aggregated geography only and does not publish exact sensitive locations, live geospatial feeds, restricted evidence, sacred-site information, vulnerable ecological locations, or community-submitted private data. Map-sensitive layers remain deferred until review records support public-safe release.",
    linkedClaimIds: ["CLAIM-DRC-CO-004", "CLAIM-DRC-CO-005"],
    linkedEvidenceIds: ["EVID-USGS-ASM-001", "EVID-UNICEF-ASM-001", "EVID-AMNESTY-CO-001"],
    sourceIds: ["SM-GFW", "SM-ECOLOGY-GLOBAL", "SM-CARE-GIS", "SM-UNDRIP-HR"],
    publicLimitations: [
      "Map-safety posture does not validate geospatial accuracy, exposure safety, rights-holder consent, ecological sensitivity, or legal adequacy.",
      "Restricted, unsafe, or do-not-publish geospatial material is suppressed from public output.",
      "Correction and harm-reporting pathways remain available for public-safe challenges to disclosure posture.",
    ],
    exposureNotes: [
      "Geospatial, labour, ecological, and community-sensitive disclosures require suppression or aggregation unless release review confirms a public-safe posture.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Right-of-reply ────────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-right_of_reply",
    section: "right_of_reply",
    title: "Right-of-reply discipline",
    status: "drafting",
    summary:
      "This section documents the right-of-reply posture for dossier claims. It depends on claim fields, publication rules, and correction governance to identify claims that could materially affect actors. Current public claims are framed as method limits, public-record context, risk documentation, or evidence gaps without naming new actors. If future claims name or materially affect identifiable firms, officials, communities, or other actors, notice and response posture must be resolved before release. This is structural readiness only and does not determine fairness, legal sufficiency, or notice adequacy.",
    linkedClaimIds: [
      "CLAIM-DRC-CO-001",
      "CLAIM-DRC-CO-003",
      "CLAIM-DRC-CO-005",
      "CLAIM-DRC-CO-007",
    ],
    linkedEvidenceIds: [
      "EVID-UNCOMTRADE-CO-001",
      "EVID-EITI-DRC-001",
      "EVID-UNICEF-ASM-001",
      "EVID-AMNESTY-CO-001",
      "EVID-OPENOWNERSHIP-DRC-001",
    ],
    sourceIds: ["SM-EITI", "SM-OPEN-OWNERSHIP", "SM-UNDRIP-HR"],
    publicLimitations: [
      "Right-of-reply status is a publication discipline, not a concession that a claim is wrong.",
      "The dossier does not expose actor contact data, packets, reviewer notes, or private correspondence.",
      "Correction routes remain open for factual, disclosure, and source challenges.",
    ],
    exposureNotes: [
      "Actor-affecting claims require right-of-reply posture before release; internal packets and contact data must remain private.",
    ],
    lastUpdated: V07_UPDATED,
  },

  // ── Release manifest ──────────────────────────────────────────────────────────
  {
    id: "CDS-CU-CO-release_manifest",
    section: "release_manifest",
    title: "Release manifest",
    status: "not_started",
    summary:
      "This section documents the release-manifest boundary for the corridor record. It depends on structural readiness across dossier sections, claim/evidence/source linkage, source posture, right-of-reply posture, map-safety posture, correction route, and release-owner sign-off. The manifest is not signed, not published, and not used to approve claims in this pass. Manifest assembly, signing, hash generation, and public release packaging remain deferred until blockers and review flags are resolved.",
    linkedClaimIds: [],
    linkedEvidenceIds: [],
    sourceIds: [],
    publicLimitations: [
      "This dossier is not release-ready and does not approve publication.",
      "No manifest is signed, published, enforced, or represented as release clearance.",
      "Release readiness remains an internal structural check and does not validate factual truth, legal status, source rights, exposure safety, notice adequacy, or publication approval.",
    ],
    exposureNotes: [],
    lastUpdated: V07_UPDATED,
  },
];

const sections: CorridorDossierSectionRecord[] = sectionSeeds.map((section) => ({
  ...section,
  recordMode: "illustrative",
}));

export const copperCobaltCorridorPilotSkeleton: CorridorDossier = {
  id: "CDR-CU-CO-PILOT-001",
  recordMode: "illustrative",
  title: "Earth Endowment Observatory: Critical Minerals Corridor Evidence Record",
  corridorCaseId: "CORRIDOR-CU-CO-001",
  corridorCharterId: "CHARTER-CU-CO-001",
  corridorCharterVersion: "0.1-draft",
  primaryDomainId: "geological_mineral",
  linkedDomainIds: [
    "energy",
    "freshwater_cryosphere",
    "land_soil_food",
    "biodiversity_ecosystem_functions",
    "atmosphere_climate_regulation",
  ],
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
  corridor: "Copper-Cobalt Critical Minerals Corridor",
  geography:
    "Corridor framing only — jurisdictions to be enumerated with evidence-backed boundary notes in later milestones.",
  commodityFocus: ["copper", "cobalt"],
  purpose:
    "To test whether EEO can produce one safe, sourced, reviewable, correctable endowment-to-economy corridor dossier before attempting broader observatory scope.",
  scopeStatement:
    "This corridor record focuses on public, low-exposure evidence about the copper-cobalt corridor. It examines how a critical mineral endowment enters economic life through governance, concessions, operators, ownership/control structures, extraction, processing, trade, labour conditions, ecological signals, public revenue, value-capture questions, and public-benefit implications.",
  nonGoals: [
    "It does not provide product-level chain-of-custody verification.",
    "It does not claim that a specific consumer product contains cobalt or copper from a specific mine.",
    "It does not adjudicate legal liability.",
    "It does not publish sensitive community, sacred-site, whistleblower, or vulnerable ecological location data.",
    "It does not compare corridors, countries, firms, or communities through composite indicators.",
    "It does not claim authority over states, Indigenous peoples, communities, firms, or resources.",
    "It does not launch a global atlas.",
  ],
  sections,
  releaseReadiness: "not_ready",
  publicLimitations: [
    "Under review. Public sections now carry cautious narrative, but release remains incomplete.",
    "Claims CLAIM-DRC-CO-004 (extraction/ASM) and CLAIM-DRC-CO-006 (public revenue) are under method review.",
    "Claim CLAIM-DRC-CO-005 (labour risk) is under exposure review; publication posture is publish_with_redactions.",
    "Actor-affecting claims require correction and right-of-reply posture before release.",
    "Temporal profiling, monitoring signals, and forecasting UI remain deferred milestones (see ROADMAP.md).",
  ],
  lastUpdated: V07_UPDATED,
};
