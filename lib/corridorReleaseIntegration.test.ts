import { describe, expect, it } from "vitest";

import { claims } from "@/data/claims";
import { copperCobaltCorridorPilotSkeleton } from "@/data/corridorDossier";
import { copperCobaltProvisionalCharter } from "@/data/corridorCharters";
import { copperCobaltLayerAssessments } from "@/data/crossCuttingLayerAssessments";
import { evidenceItems } from "@/data/evidence";
import { releaseManifest } from "@/data/releaseManifest";
import { sources } from "@/data/sources";
import { assessReleaseManifestReadiness } from "@/lib/releaseManifestReadiness";

describe("corridor Charter integration", () => {
  it("keeps the actual Copper-Cobalt release path blocked while the Charter is provisional", () => {
    const assessment = assessReleaseManifestReadiness({
      dossier: copperCobaltCorridorPilotSkeleton,
      claims,
      evidenceItems,
      sources,
      corridorCharter: copperCobaltProvisionalCharter,
      corridorLayerAssessments: copperCobaltLayerAssessments,
      releaseManifest,
    });

    const issueTypes = assessment.blockingStructuralIssues.map(
      (issue) => issue.type
    );

    expect(assessment.corridorCharterBindingPasses).toBe(true);
    expect(assessment.releaseManifestBindingPasses).toBe(true);
    expect(assessment.corridorAuthorizationPasses).toBe(false);
    expect(assessment.corridorLayerReadinessPasses).toBe(false);
    expect(issueTypes).toContain("corridor_authorization_not_ready");
    expect(issueTypes).toContain("mandatory_corridor_layers_not_ready");
  });
  it("blocks legacy dossiers that omit structured corridor governance", () => {
    const legacy = { ...copperCobaltCorridorPilotSkeleton };
    delete legacy.corridorCaseId;
    delete legacy.corridorCharterId;
    delete legacy.corridorCharterVersion;
    delete legacy.crossCuttingLayerAssessmentIds;
    const assessment = assessReleaseManifestReadiness({
      dossier: { ...legacy, releaseReadiness: "release_candidate" },
      claims,
      evidenceItems,
      sources,
    });
    expect(assessment.corridorAuthorizationPasses).toBe(false);
    expect(assessment.blockingStructuralIssues.map((item) => item.type)).toContain("corridor_charter_binding_mismatch");
    expect(assessment.blockingStructuralIssues.map((item) => item.type)).toContain("release_manifest_binding_mismatch");
  });

  it("blocks a stale or unprovided manifest binding", () => {
    const inputs = {
      dossier: copperCobaltCorridorPilotSkeleton,
      claims,
      evidenceItems,
      sources,
      corridorCharter: copperCobaltProvisionalCharter,
      corridorLayerAssessments: copperCobaltLayerAssessments,
    };
    const missing = assessReleaseManifestReadiness(inputs);
    const stale = assessReleaseManifestReadiness({
      ...inputs,
      releaseManifest: { ...releaseManifest, corridorCharterVersion: "stale-version" },
    });
    expect(missing.releaseManifestBindingPasses).toBe(false);
    expect(stale.releaseManifestBindingPasses).toBe(false);
    expect(stale.blockingStructuralIssues.map((item) => item.type)).toContain("release_manifest_binding_mismatch");
  });

  it("blocks missing, duplicated, and changed mandatory layer bindings", () => {
    const inputs = {
      dossier: copperCobaltCorridorPilotSkeleton,
      claims,
      evidenceItems,
      sources,
      corridorCharter: copperCobaltProvisionalCharter,
      corridorLayerAssessments: copperCobaltLayerAssessments,
    };
    for (const ids of [
      [],
      [releaseManifest.crossCuttingLayerAssessmentIds![0]!],
      [...releaseManifest.crossCuttingLayerAssessmentIds!, releaseManifest.crossCuttingLayerAssessmentIds![0]!],
      releaseManifest.crossCuttingLayerAssessmentIds!.map((id, index) => index === 0 ? "WRONG-LAYER" : id),
    ]) {
      const assessment = assessReleaseManifestReadiness({
        ...inputs,
        releaseManifest: { ...releaseManifest, crossCuttingLayerAssessmentIds: ids },
      });
      expect(assessment.releaseManifestBindingPasses).toBe(false);
    }
  });
});
