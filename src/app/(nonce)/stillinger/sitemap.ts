import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const TWO_HOURS_IN_SECONDS = 7200;

type Ad = {
    uuid: string;
    updated: string;
};
/**
 * Genererer sitemap.xml
 */
export default async function sitemap(): Promise<Array<MetadataRoute.Sitemap>> {
    async function getAds() {
        const response = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/scroll`, {
            next: { revalidate: TWO_HOURS_IN_SECONDS },
        });
        return response.json();
    }

    const ads = await getAds();

    const adEntries = ads.map((ad: Ad) => ({
        url: `https://arbeidsplassen.nav.no/stillinger/stilling/${ad.uuid}`,
        lastModified: ad.updated ? ad.updated.split("T")[0] : "",
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const searchUrlEntry = {
        url: "https://arbeidsplassen.nav.no/stillinger",
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: "hourly",
        priority: 1,
    };

    return [searchUrlEntry, ...adEntries];
}
