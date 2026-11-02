import type { MetadataRoute } from "next";
import { flatNav, href, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return flatNav.map((n) => ({ url: `${site.url}${href(n.slug)}`, changeFrequency: "weekly", priority: n.slug ? 0.7 : 1 }));
}
