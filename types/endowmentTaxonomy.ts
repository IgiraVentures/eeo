/**
 * Canonical classification layer for EEO corridor work.
 * Domains classify endowments and system context. They are not public products
 * and do not imply that EEO has activated a corridor in every domain.
 */
export const ENDOWMENT_DOMAIN_IDS = [
  "geological_mineral",
  "energy",
  "freshwater_cryosphere",
  "forest_woodland",
  "land_soil_food",
  "ocean_coastal",
  "biodiversity_ecosystem_functions",
  "atmosphere_climate_regulation",
] as const;

export type EndowmentDomainId = (typeof ENDOWMENT_DOMAIN_IDS)[number];

export const CORRIDOR_STATUSES = [
  "roadmap",
  "candidate",
  "provisional",
  "authorized",
  "active_internal",
  "limited_beta",
  "public",
  "paused",
  "retired",
] as const;

export type CorridorStatus = (typeof CORRIDOR_STATUSES)[number];

export interface EndowmentDomainDefinition {
  id: EndowmentDomainId;
  name: string;
  purpose: string;
  includes: string[];
  boundaryNotes: string[];
  sensitivityNotes: string[];
}

export interface CorridorFamilyDefinition {
  id: string;
  name: string;
  primaryDomainId: EndowmentDomainId;
  linkedDomainIds: EndowmentDomainId[];
  purpose: string;
  examples: string[];
}

export interface CorridorCaseDefinition {
  id: string;
  slug: string;
  name: string;
  familyId: string;
  primaryDomainId: EndowmentDomainId;
  linkedDomainIds: EndowmentDomainId[];
  status: CorridorStatus;
  publicProductActive: boolean;
  publicSummary: string;
  classificationNote: string;
}
