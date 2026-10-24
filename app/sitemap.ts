import type { MetadataRoute } from "next";

const SITE_URL = "https://eeo-ten.vercel.app";

/**
 * Discovery is restricted to institutional overview pages.
 * Synthetic, reviewed, restricted, internal and unpublished claim records
 * must not be promoted to search indexes by an automatic route crawl.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/observatory",
    "/corridors/copper-cobalt",
    "/methods",
    "/governance",
    "/safeguards",
    "/disclosure-policy",
    "/privacy",
    "/accessibility",
    "/contact",
    "/corrections",
  ];
  return pages.map((path) => ({
    url: SITE_URL + path,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));
}
