import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import { cookies } from "next/headers";
import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/stilling/[id]/_similarity_search/fetchElasticSearch";
import { SimilarAdsSearchQuery } from "@/app/stillinger/stilling/[id]/_similarity_search/elasticSimilaritySearchRequestBody";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { logger } from "@navikt/next-logger";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";
import { SearchParams } from "next/dist/server/request/search-params";
import { resolveCanonical } from "@/app/stillinger/stilling/[id]/resolveCanonical";
import { Metadata } from "next";

const getOrgCookie = async (): Promise<string | undefined> => {
    try {
        const requestCookies = await cookies();
        return requestCookies.get("organizationNumber")?.value;
    } catch {
        return undefined;
    }
};
type Params = Promise<{ id: string }>;

type PageProps = {
    params: Params;
    searchParams: Promise<SearchParams>;
};

function getPostcodeFromAd(adData: AdDTO): string | undefined {
    if (adData && adData.locationList && adData.locationList.length == 1 && adData.locationList[0].postalCode) {
        return adData.locationList[0].postalCode;
    }
}

function getCountiesFromAd(adData: AdDTO): string[] | undefined {
    if (adData && adData.locationList) {
        const counties: string[] = adData.locationList
            .map((location) => location.county)
            .filter((county) => typeof county === "string");
        return [...new Set(counties)];
    }
}

function getKnnQuery(adData: AdDTO, explain: boolean = false): SimilarAdsSearchQuery {
    let searchParams: SimilarAdsSearchQuery = {
        from: 0,
        size: 4,
        explain,
    };

    // explain parameter for debugging

    // Filter with postcode or county
    const postcode = getPostcodeFromAd(adData);
    if (postcode) {
        searchParams = {
            ...searchParams,
            postcode,
            distance: "50",
        };
    } else {
        const counties = getCountiesFromAd(adData);
        if (counties) {
            searchParams = {
                ...searchParams,
                counties,
            };
        }
    }

    // Get vector
    if (adData && adData.compositeAdVector) {
        searchParams = {
            ...searchParams,
            compositeAdVector: adData.compositeAdVector,
        };
    }

    return searchParams;
}

async function getSimilarAds(
    adData: AdDTO,
    adId: string,
    explain: boolean = false,
): Promise<SimilaritySearchResultData | undefined> {
    const similarAdQuery = getKnnQuery(adData, explain);

    if (!similarAdQuery || !similarAdQuery.compositeAdVector) {
        logger.info(`No compositeAdVector found for ad ${adData.id}, cannot perform similarity search.`);
        return undefined;
    } else if (similarAdQuery.counties === undefined && similarAdQuery.postcode === undefined) {
        logger.warn(`No location data found for ad ${adData.id}, check if correct.`);
    }

    const headers = await getDefaultHeaders();
    const searchResult = await fetchCachedSimplifiedElasticSearch(similarAdQuery, headers);
    return {
        ads: searchResult?.data?.ads?.filter((ad) => ad.uuid !== adId) || [],
        totalAds: searchResult?.data?.totalAds ? searchResult.data.totalAds - 1 : 0,
    };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const response = await getAdData(params.id);

    const sourceLower = response?.source?.toLowerCase() ?? "";
    const canonical = resolveCanonical({
        sourceLower,
        sourceUrl: response?.sourceUrl,
        adId: params.id,
    });

    const robots: Metadata["robots"] = response?.status !== "ACTIVE" ? "noindex" : undefined;

    return {
        title: getStillingTitle(response.title),
        description: getStillingDescription(response),
        robots,
        alternates: {
            canonical: canonical ? canonical : undefined,
        },
    };
}

export default async function Page(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const response = await getAdData(params.id);

    const organizationNumber = await getOrgCookie();

    const explain = searchParams?.explain === "true";
    const similarAds = await getSimilarAds(response, params.id, explain);

    return <Ad adData={response} organizationNumber={organizationNumber} searchResult={similarAds} explain={explain} />;
}
