import type { MapSafetyClassification } from "@/types/mapSafety";

/**
 * Public map rendering gate.
 * Only open/generalized/aggregated layers can be rendered publicly by default.
 * Blurred, delayed-release, metadata-only, restricted, do-not-collect, and
 * do-not-publish classifications require different handling and remain blocked
 * from direct public map rendering.
 */
export function canRenderPublicMapLayer(classification: MapSafetyClassification): boolean {
  return classification === "open" || classification === "generalized" || classification === "aggregated";
}

export function assertPublicMapLayerAllowed(classification: MapSafetyClassification): void {
  if (!canRenderPublicMapLayer(classification)) {
    throw new Error("Unsafe map layer cannot be rendered publicly.");
  }
}
