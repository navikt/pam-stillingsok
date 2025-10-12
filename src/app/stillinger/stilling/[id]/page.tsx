import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import { cookies } from "next/headers";
import { Metadata } from "@/app/stillinger/stilling/_data/types";
import { ReactElement } from "react";
import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/stilling/[id]/_similarity_search/fetchElasticSearch";
import { SearchQuery } from "@/app/stillinger/(sok)/_utils/query";
import { StillingDetaljer } from "@/app/stillinger/_common/lib/stillingSchema";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

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

function getPostcodeFromAd(adData: StillingDetaljer): string | undefined {
    if (adData && adData.locationList && adData.locationList.length == 1 && adData.locationList[0].postalCode) {
        return adData.locationList[0].postalCode;
    }
}

function getCountiesFromAd(adData: StillingDetaljer): string[] | undefined {
    if (adData && adData.locationList) {
        const counties: string[] = adData.locationList
            .map((location) => location.county)
            .filter((county) => typeof county === "string");
        return [...new Set(counties)];
    }
}

function getKnnQuery(adData: StillingDetaljer, explain: boolean = false): SearchQuery {
    let searchParams: SearchQuery = {
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const response = await getAdData(params.id);

    const isFinn = response && response?.source && response.source.toLowerCase() === "finn";

    const title = response ? response?.title : undefined;
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
    const response: StillingDetaljer = await getAdData(params.id);

    const organizationNumber = getOrgCookie();

    const explain = searchParams?.explain === "true";
    const similarAdQuery = getKnnQuery(response, explain);

    const headers = await getDefaultHeaders();
    const searchResult = await fetchCachedSimplifiedElasticSearch(similarAdQuery, headers);
    const data = {
        ads: searchResult?.data?.ads?.filter((ad) => ad.uuid !== params.id) || [],
        totalAds: searchResult?.data?.totalAds ? searchResult.data.totalAds - 1 : 0,
    };

    return <Ad adData={response} organizationNumber={organizationNumber} searchResult={data} explain={explain} />;
}
