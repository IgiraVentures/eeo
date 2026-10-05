/**
 * Map publication gate types — no runtime geospatial pipelines in prototype.
 */

export type MapSafetyClassification =
  | "open"
  | "generalized"
  | "aggregated"
  | "blurred"
  | "delayed_release"
  | "metadata_only"
  | "restricted"
  | "do_not_collect"
  | "do_not_publish";

export interface MapSafetyReview {
  id: string;
  layerName: string;
  classification: MapSafetyClassification;
  publicRationale: string;
  risksConsidered: string[];
  mitigation: string[];
  reviewedAt: string;
  reviewerRole: "method" | "legal" | "exposure" | "community" | "ecology" | "system";
}
