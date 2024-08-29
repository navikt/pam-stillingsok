export const dynamic = "force-dynamic";

const TWO_HOURS_IN_SECONDS = 7200;

export default async function sitemap() {
    async function getAds() {
        const response = await fetch(`${process.env.PAMSEARCHAPI_URL}/scroll/ad`, {
            next: { revalidate: TWO_HOURS_IN_SECONDS },
        });
        return response.json();
    }

    const ads = await getAds();

    const adEntries = ads.map((ad) => ({
        url: `https://arbeidsplassen.nav.no/stillinger/stilling/${ad.uuid}`,
        lastModified: ad.updated ? ad.updated.split("T")[0] : "",
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const searchUrlEntry = {
        url: `https://arbeidsplassen.nav.no/stillinger`,
        lastModified: new Date().toISOString().split("T")[0],
        priority: 1,
        changeFrequency: "hourly",
    };

    return [searchUrlEntry].concat(adEntries);
}
