import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as reviewerMetadata } from "@/app/review/layout";
import { metadata as workspaceMetadata } from "@/app/workspace/layout";

const PRIVATE_ROOTS = ["/review", "/workspace", "/api"];

describe("EEO controlled discovery", () => {
  it("disallows private route roots and all their descendants", () => {
    const policy = robots();
    expect(policy.rules).toMatchObject({
      userAgent: "*",
      disallow: expect.arrayContaining(PRIVATE_ROOTS),
    });
    const rules = Array.isArray(policy.rules) ? policy.rules[0] : policy.rules;
    const disallow = typeof rules.disallow === "string" ? [rules.disallow] : rules.disallow ?? [];
    for (const path of [
      "/review",
      "/review/login",
      "/workspace",
      "/workspace/sources",
      "/api",
      "/api/corrections",
    ]) {
      expect(disallow.some((prefix) => path.startsWith(prefix))).toBe(true);
    }
    expect(policy.host).toBe("https://eeo-ten.vercel.app");
    expect(policy.sitemap).toBe("https://eeo-ten.vercel.app/sitemap.xml");
  });

  it("marks all internal reviewer and workspace pages as non-indexable", () => {
    for (const metadata of [reviewerMetadata, workspaceMetadata]) {
      expect(metadata.robots).toMatchObject({
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      });
    }
  });

  it("keeps the sitemap on the stable production host and excludes internal routes", () => {
    const pages = sitemap();
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const url = new URL(page.url);
      expect(url.origin).toBe("https://eeo-ten.vercel.app");
      expect(PRIVATE_ROOTS.some((path) => url.pathname === path || url.pathname.startsWith(path + "/"))).toBe(false);
      expect(url.pathname).not.toMatch(/\/api\/|\/review\/|\/workspace\//);
    }
  });
});
