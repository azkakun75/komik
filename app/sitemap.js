import { SITE } from "@/lib/themes";

export default function sitemap() {
  const now = new Date();
  const routes = [
    "",
    "/search",
    "/library",
    "/about",
    "/genres",
    "/random",
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: p === "" ? 1 : 0.7,
  }));
  return routes;
}
