import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import { cookies } from "next/headers";
import { Metadata } from "@/app/stillinger/stilling/_data/types";
import { ReactElement } from "react";
import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/stilling/[id]/_similarity_search/fetchElasticSearch";
import { SimilarAdsSearchQuery } from "@/app/stillinger/stilling/[id]/_similarity_search/elasticSimilaritySearchRequestBody";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import logger from "@/app/min-side/_common/utils/logger";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";

const getOrgCookie = (): string | undefined => {
    try {
        return cookies().get("organizationNumber")?.value;
    } catch (err) {
        return undefined;
    }
};
type PageProps = {
    params: {
        id: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const response = await getAdData(params.id);

    const isFinn = response && response?.source && response.source.toLowerCase() === "finn";

    const title = response ? response?.title : null;
    const data = response || undefined;
    return {
        title: getStillingTitle(title),
        description: getStillingDescription(data),
        robots: response && data?.status !== "ACTIVE" ? "noindex" : "",
        alternates: {
            canonical: isFinn && data?.sourceUrl ? data?.sourceUrl : "",
        },
    };
}

export default async function Page({ params, searchParams }: PageProps): Promise<ReactElement> {
    const response = await getAdData(params.id);

    const organizationNumber = getOrgCookie();

    const explain = searchParams?.explain === "true";
    const similarAds = await getSimilarAds(response, params.id, explain);

    return <Ad adData={response} organizationNumber={organizationNumber} searchResult={similarAds} explain={explain} />;
}
