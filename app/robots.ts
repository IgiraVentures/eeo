import type { MetadataRoute } from "next";

const SITE_URL = "https://eeo-ten.vercel.app";

/**
 * Crawler instructions supplement, but do not replace, server-side access
 * control. Include the exact internal route roots as well as their descendants.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/workspace", "/workspace/", "/review", "/review/", "/api", "/api/"],
    },
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL,
  };
}
