// Google's limit is 50,000 URLs per sitemap.
const MAX_ALLOWED_SITEMAP_URLS = 50000;

const SEARCH_API_PAGE_SIZE_LIMIT = 10000;

async function fetchAds(searchAfter) {
    const body = {
        size: SEARCH_API_PAGE_SIZE_LIMIT,
        query: {
            bool: {
                filter: {
                    term: {
                        status: "ACTIVE",
                    },
                },
            },
        },
        _source: {
            includes: ["updated", "uuid"],
        },
        sort: [{ updated: "desc" }],
    };

    if (searchAfter) {
        body["search_after"] = [searchAfter];
    }

    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return res.json();
}

async function fetchAllAds() {
    let ads = [];

    // Search_after is used to retrieve the next page of hits
    let searchAfter = undefined;

    // Loop through and fetch all ads in smaller chunks
    for (let i = 0; i < MAX_ALLOWED_SITEMAP_URLS; i += SEARCH_API_PAGE_SIZE_LIMIT) {
        if (i !== 0 && !searchAfter) {
            break; // No more data
        }
        const response = await fetchAds(searchAfter);
        if (response.hits.hits.length > 0) {
            searchAfter = response.hits.hits[response.hits.hits.length - 1]["sort"][0];
            ads = [...ads, ...response.hits.hits];
        }
    }
    return ads;
}

export default async function sitemap() {
    const ads = await fetchAllAds();

    const commonSitemapEntries = [
        {
            url: `https://arbeidsplassen.nav.no/stillinger`,
            lastModified: ads[0] ? ads[0].lastModified : "",
            priority: 1,
            changeFrequency: "daily",
        },
        {
            url: `https://arbeidsplassen.nav.no/stillinger?q=Sommerjobb`,
            lastModified: ads[0] ? ads[0].lastModified : "",
            priority: 0.7,
            changeFrequency: "daily",
        },
    ];

    return [
        ...commonSitemapEntries,
        ...ads.slice(0, MAX_ALLOWED_SITEMAP_URLS - commonSitemapEntries.length).map((ad) => ({
            url: `https://arbeidsplassen.nav.no/stillinger/stilling/${ad._id}`,
            lastModified: ad._source.updated,
            priority: 0.7,
            changeFrequency: "daily",
        })),
    ];
}
