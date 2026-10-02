import type { CorridorCharter } from "@/types/corridorCharter";
import { MANDATORY_CROSS_CUTTING_LAYER_IDS, type CorridorLayerAssessment } from "@/types/crossCuttingLayer";
import type { CorridorStatus } from "@/types/endowmentTaxonomy";
import type { ReleaseGateBlocker } from "@/types/releaseGate";

const AUTHORIZED_CORRIDOR_STATUSES: CorridorStatus[] = ["authorized", "active_internal", "limited_beta", "public"];

export function getCorridorAuthorizationBlockers(charter?: CorridorCharter): ReleaseGateBlocker[] {
  if (!charter) return [{ type: "corridor_charter_missing", message: "Corridor cannot proceed to public release without a Corridor Charter.", publicSafeSummary: "A Corridor Charter is required before public release." }];

  const blockers: ReleaseGateBlocker[] = [];

  if (!AUTHORIZED_CORRIDOR_STATUSES.includes(charter.status) || charter.authorizationDecision !== "go") blockers.push({ type: "corridor_not_authorized", message: "Corridor Charter has not authorized this corridor for public-release work.", objectId: charter.id, publicSafeSummary: "The corridor remains unauthorized for public release." });
  if (charter.boundary.unresolvedBoundaryQuestions.length > 0 || !charter.boundary.geographicBoundarySummary.trim() || !charter.boundary.upstreamStart.trim() || !charter.boundary.downstreamStop.trim()) blockers.push({ type: "scope_ambiguity", message: "Corridor Charter still contains unresolved geographic, temporal, upstream, or downstream scope.", objectId: charter.id, publicSafeSummary: "Corridor boundaries must be resolved before public release." });
  if (charter.unresolvedAuthorizationItems.length > 0) blockers.push({ type: "corridor_authorization_incomplete", message: "Corridor Charter contains unresolved authorization requirements.", objectId: charter.id, publicSafeSummary: "Corridor authorization requirements remain incomplete." });
  if (charter.sourceInventoryStatus !== "reviewed" || charter.licenseUseBasisStatus !== "reviewed") blockers.push({ type: "source_rights_unresolved", message: "Source inventory and license/use-basis review are not complete for the corridor scope.", objectId: charter.id, publicSafeSummary: "Source and reuse-basis review must be completed before release." });
  if (charter.evidenceCoverageStatus !== "sufficient") blockers.push({ type: "evidence_coverage_insufficient", message: "Evidence coverage is not yet sufficient for the bounded public-interest question.", objectId: charter.id, publicSafeSummary: "Evidence coverage remains insufficient for corridor release." });
  if (!charter.entityResolutionMethod.trim() || !charter.legalSovereigntyPosture.trim() || !charter.disclosureTierPlan.trim() || !charter.correctionWithdrawalProcess.trim() || charter.reviewOwnerRoles.length === 0) blockers.push({ type: "corridor_authorization_incomplete", message: "Corridor Charter is missing one or more required governance fields.", objectId: charter.id, publicSafeSummary: "Required corridor governance fields remain incomplete." });

  return blockers;
}

export function getMandatoryLayerBlockers(params: { charter: CorridorCharter; assessments: CorridorLayerAssessment[] }): ReleaseGateBlocker[] {
  const blockers: ReleaseGateBlocker[] = [];
  for (const layer of MANDATORY_CROSS_CUTTING_LAYER_IDS) {
    const assessment = params.assessments.find((candidate) => candidate.corridorCaseId === params.charter.corridorCaseId && candidate.layer === layer);
    if (!assessment) { blockers.push({ type: "mandatory_layer_unassessed", message: `Mandatory corridor layer "${layer}" has no assessment.`, objectId: params.charter.id, publicSafeSummary: "A mandatory corridor layer has not yet been assessed." }); continue; }
    if (assessment.charterId !== params.charter.id || assessment.charterVersion !== params.charter.version) { blockers.push({ type: "charter_version_mismatch", message: `Layer assessment ${assessment.id} is not bound to the current Charter version.`, objectId: assessment.id, publicSafeSummary: "A layer assessment must be refreshed for the current Corridor Charter." }); continue; }
    if (assessment.status === "blocked") { blockers.push({ type: "mandatory_layer_blocked", message: `Mandatory corridor layer "${layer}" is blocked.`, objectId: assessment.id, publicSafeSummary: "A mandatory corridor layer is blocked and prevents release." }); continue; }
    if (assessment.status === "not_material" && assessment.materialityRationale.trim().length > 0) continue;
    if (assessment.status !== "ready") blockers.push({ type: "mandatory_layer_not_ready", message: `Mandatory corridor layer "${layer}" has not reached ready status.`, objectId: assessment.id, publicSafeSummary: "A mandatory corridor layer has not completed review." });
  }
  return blockers;
}

export function assessCorridorPublicationReadiness(params: { charter?: CorridorCharter; assessments: CorridorLayerAssessment[] }): { ready: boolean; blockers: ReleaseGateBlocker[] } {
  const authorizationBlockers = getCorridorAuthorizationBlockers(params.charter);
  if (!params.charter) return { ready: false, blockers: authorizationBlockers };
  const blockers = [...authorizationBlockers, ...getMandatoryLayerBlockers({ charter: params.charter, assessments: params.assessments })];
  return { ready: blockers.length === 0, blockers };
}
