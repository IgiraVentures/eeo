import type { CorridorCaseDefinition, CorridorFamilyDefinition } from "@/types/endowmentTaxonomy";

export const COPPER_COBALT_CORRIDOR_CASE_ID = "CORRIDOR-CU-CO-001";

export const CORRIDOR_FAMILIES: CorridorFamilyDefinition[] = [
  {
    id: "critical-minerals",
    name: "Critical Minerals",
    primaryDomainId: "geological_mineral",
    linkedDomainIds: ["energy", "freshwater_cryosphere", "land_soil_food", "biodiversity_ecosystem_functions", "atmosphere_climate_regulation"],
    purpose: "Organize bounded mineral cases where endowment, extraction, processing, trade, labor, public finance, ecological effects, and energy-transition demand intersect.",
    examples: ["Copper-cobalt", "Lithium", "Nickel", "Graphite", "Rare-earth elements"],
  },
];

export const CORRIDOR_CASES: CorridorCaseDefinition[] = [
  {
    id: COPPER_COBALT_CORRIDOR_CASE_ID,
    slug: "copper-cobalt",
    name: "Copper-Cobalt Endowment-to-Economy Corridor",
    familyId: "critical-minerals",
    primaryDomainId: "geological_mineral",
    linkedDomainIds: ["energy", "freshwater_cryosphere", "land_soil_food", "biodiversity_ecosystem_functions", "atmosphere_climate_regulation"],
    status: "provisional",
    publicProductActive: false,
    publicSummary: "EEO's flagship prototype case for testing a bounded, evidence-supported critical-minerals dossier.",
    classificationNote: "This catalog entry classifies the current pilot. It does not authorize geography, publication, named allegations, or a complete chain-of-custody claim.",
  },
];
