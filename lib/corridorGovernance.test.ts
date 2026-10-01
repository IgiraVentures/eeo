import { describe, expect, it } from "vitest";
import { copperCobaltLayerAssessments } from "@/data/crossCuttingLayerAssessments";
import { copperCobaltProvisionalCharter } from "@/data/corridorCharters";
import { assessCorridorPublicationReadiness, getCorridorAuthorizationBlockers } from "@/lib/corridorGovernance";

describe("corridor governance", () => {
  it("fails closed when no Corridor Charter exists", () => {
    expect(getCorridorAuthorizationBlockers().map((b) => b.type)).toContain("corridor_charter_missing");
  });

  it("keeps the current copper-cobalt Charter provisional and blocked", () => {
    const result = assessCorridorPublicationReadiness({ charter: copperCobaltProvisionalCharter, assessments: copperCobaltLayerAssessments });
    expect(result.ready).toBe(false);
    expect(result.blockers.map((b) => b.type)).toContain("corridor_not_authorized");
    expect(result.blockers.map((b) => b.type)).toContain("scope_ambiguity");
    expect(result.blockers.map((b) => b.type)).toContain("mandatory_layer_not_ready");
  });

  it("allows readiness only when Charter authorization and every mandatory layer are cleared", () => {
    const charter = { ...copperCobaltProvisionalCharter, status: "authorized" as const, authorizationDecision: "go" as const, sourceInventoryStatus: "reviewed" as const, licenseUseBasisStatus: "reviewed" as const, evidenceCoverageStatus: "sufficient" as const, unresolvedAuthorizationItems: [], boundary: { ...copperCobaltProvisionalCharter.boundary, unresolvedBoundaryQuestions: [], geographicBoundarySummary: "Approved bounded test geography.", upstreamStart: "Approved upstream boundary.", downstreamStop: "Approved downstream boundary." } };
    const assessments = copperCobaltLayerAssessments.map((assessment) => ({ ...assessment, charterId: charter.id, charterVersion: charter.version, status: "ready" as const, blockers: [] }));
    const result = assessCorridorPublicationReadiness({ charter, assessments });
    expect(result.ready).toBe(true);
    expect(result.blockers).toEqual([]);
  });

  it("blocks release when one mandatory layer is absent", () => {
    const charter = { ...copperCobaltProvisionalCharter, status: "authorized" as const, authorizationDecision: "go" as const, sourceInventoryStatus: "reviewed" as const, licenseUseBasisStatus: "reviewed" as const, evidenceCoverageStatus: "sufficient" as const, unresolvedAuthorizationItems: [], boundary: { ...copperCobaltProvisionalCharter.boundary, unresolvedBoundaryQuestions: [], geographicBoundarySummary: "Approved bounded test geography.", upstreamStart: "Approved upstream boundary.", downstreamStop: "Approved downstream boundary." } };
    const assessments = copperCobaltLayerAssessments.filter((a) => a.layer !== "waste_circularity_restoration_future_liability").map((assessment) => ({ ...assessment, charterId: charter.id, charterVersion: charter.version, status: "ready" as const, blockers: [] }));
    const result = assessCorridorPublicationReadiness({ charter, assessments });
    expect(result.ready).toBe(false);
    expect(result.blockers.map((b) => b.type)).toContain("mandatory_layer_unassessed");
  });
});
