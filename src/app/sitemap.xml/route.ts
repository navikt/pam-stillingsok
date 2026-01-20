import { NextResponse } from "next/server";

const BASE_URL = "https://arbeidsplassen.nav.no";

const createSitemapIndexXml = (entries: readonly string[]): string => {
    const xmlEntries = entries
        .map((entryPath) => {
            return `  <sitemap>\n    <loc>${BASE_URL}${entryPath}</loc>\n  </sitemap>`;
        })
        .join("\n");

    return (
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${xmlEntries}\n` +
        `</sitemapindex>\n`
    );
};

const SITEMAP_INDEX_XML: string = createSitemapIndexXml(["/sitemaps/innhold/sitemap.xml", "/stillinger/sitemap.xml"]);

export function GET(): NextResponse {
    return new NextResponse(SITEMAP_INDEX_XML, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
        },
    });
}
