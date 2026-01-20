import { NextResponse } from "next/server";

const BASE_URL = "https://arbeidsplassen.nav.no";

const SITEMAP_INDEX_XML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemaps/innhold/sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/stillinger/sitemap.xml</loc>
  </sitemap>
</sitemapindex>
`;

export function GET(): NextResponse {
    return new NextResponse(SITEMAP_INDEX_XML, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600",
        },
    });
}
