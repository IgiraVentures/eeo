import { describe, expect, it } from "vitest";

import { claims } from "@/data/claims";
import { copperCobaltCorridorPilotSkeleton } from "@/data/corridorDossier";
import { copperCobaltProvisionalCharter } from "@/data/corridorCharters";
import { copperCobaltLayerAssessments } from "@/data/crossCuttingLayerAssessments";
import { evidenceItems } from "@/data/evidence";
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
    });

    const issueTypes = assessment.blockingStructuralIssues.map(
      (issue) => issue.type
    );

    expect(assessment.corridorCharterBindingPasses).toBe(true);
    expect(assessment.corridorAuthorizationPasses).toBe(false);
    expect(assessment.corridorLayerReadinessPasses).toBe(false);
    expect(issueTypes).toContain("corridor_authorization_not_ready");
    expect(issueTypes).toContain("mandatory_corridor_layers_not_ready");
  });
});
