export default async function sitemap() {
    async function getAds() {
        const response = await fetch(`${process.env.PAMSEARCHAPI_URL}/scroll/ad`);
        return response.json();
    }

    const ads = await getAds();

    return ads.map((ad) => ({
        url: `https://arbeidsplassen.nav.no/stillinger/${ad.uuid}`,
        lastModified: ad.updated,
        changeFrequency: "daily",
        priority: 0.9,
    }));
}
