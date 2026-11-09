import { afterEach, describe, expect, it, beforeEach, vi } from "vitest";

import * as persistence from "@/lib/eeoJsonPersistence";

import { POST } from "@/app/api/corrections/route";
import { listCorrectionSubmissions, resetCorrectionsStoreForTests } from "@/lib/correctionsStore";

describe("POST /api/corrections", () => {
  beforeEach(() => {
    resetCorrectionsStoreForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("accepts optional claimId and stores it", async () => {
    const res = await POST(
      new Request("http://localhost/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A User",
          email: "a@example.com",
          category: "Factual correction",
          details: "Please fix X.",
          claimId: "CLAIM-DRC-CO-001",
        }),
      })
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: string };
    const stored = listCorrectionSubmissions().find((s) => s.id === body.id);
    expect(stored?.claimId).toBe("CLAIM-DRC-CO-001");
  });

  it("auto-links claimId when only claimReference matches a known claim id", async () => {
    const res = await POST(
      new Request("http://localhost/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A User",
          email: "b@example.com",
          category: "Source update",
          details: "See claim id in reference.",
          claimReference: "CLAIM-DRC-CO-001",
        }),
      })
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: string };
    const stored = listCorrectionSubmissions().find((s) => s.id === body.id);
    expect(stored?.claimId).toBe("CLAIM-DRC-CO-001");
    expect(stored?.claimReference).toBe("CLAIM-DRC-CO-001");
  });

  it("stores explicit claimId even when not in the prototype claims list", async () => {
    await POST(
      new Request("http://localhost/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "A User",
          email: "c@example.com",
          category: "Factual correction",
          details: "Text",
          claimId: "UNKNOWN-CLAIM",
        }),
      })
    );
    const stored = listCorrectionSubmissions()[0];
    expect(stored?.claimId).toBe("UNKNOWN-CLAIM");
  });

  const validRequest = () =>
    new Request("http://localhost/api/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Submitter",
        email: "submitter@example.com",
        category: "Factual correction",
        details: "Correction evidence.",
      }),
    });

  it.each([
    ["VERCEL", "1"],
    ["DISABLE_EEO_FILE_PERSISTENCE", "true"],
  ])("rejects intake when %s=%s", async (key, value) => {
    vi.stubEnv(key, value);
    const response = await POST(validRequest());
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(((await response.json()) as { error: string }).error).toMatch(/temporarily unavailable/);
    expect(listCorrectionSubmissions()).toHaveLength(0);
  });

  it("never acknowledges a failed filesystem write", async () => {
    vi.stubEnv("VITEST", "false");
    const write = vi.spyOn(persistence, "atomicWriteJsonSync").mockImplementation(() => {
      throw new Error("simulated write error");
    });
    const response = await POST(validRequest());
    expect(response.status).toBe(503);
    expect(write).toHaveBeenCalledOnce();
    expect(listCorrectionSubmissions()).toHaveLength(0);
  });

});
