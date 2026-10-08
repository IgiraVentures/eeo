import { describe, expect, it } from "vitest";
import { COPPER_COBALT_CORRIDOR_CASE_ID, CORRIDOR_CASES } from "@/data/corridorCatalog";
import { copperCobaltLayerAssessments } from "@/data/crossCuttingLayerAssessments";
import { ENDOWMENT_DOMAINS } from "@/data/endowmentDomains";
import { ENDOWMENT_DOMAIN_IDS } from "@/types/endowmentTaxonomy";
import { MANDATORY_CROSS_CUTTING_LAYER_IDS } from "@/types/crossCuttingLayer";

describe("corridor taxonomy integrity", () => {
  it("defines each canonical endowment domain exactly once", () => {
    const ids = ENDOWMENT_DOMAINS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ENDOWMENT_DOMAIN_IDS.length);
    expect(new Set(ids)).toEqual(new Set(ENDOWMENT_DOMAIN_IDS));
  });

  it("keeps corridor-case domain references inside the canonical taxonomy", () => {
    const ids = new Set(ENDOWMENT_DOMAIN_IDS);
    for (const corridor of CORRIDOR_CASES) {
      expect(ids.has(corridor.primaryDomainId)).toBe(true);
      for (const linked of corridor.linkedDomainIds) expect(ids.has(linked)).toBe(true);
    }
  });

  it("keeps copper-cobalt provisional rather than active public product", () => {
    const corridor = CORRIDOR_CASES.find((c) => c.id === COPPER_COBALT_CORRIDOR_CASE_ID);
    expect(corridor?.status).toBe("provisional");
    expect(corridor?.publicProductActive).toBe(false);
  });

  it("seeds every mandatory cross-cutting layer exactly once", () => {
    const layers = copperCobaltLayerAssessments.map((a) => a.layer);
    expect(new Set(layers).size).toBe(MANDATORY_CROSS_CUTTING_LAYER_IDS.length);
    expect(new Set(layers)).toEqual(new Set(MANDATORY_CROSS_CUTTING_LAYER_IDS));
  });
});
