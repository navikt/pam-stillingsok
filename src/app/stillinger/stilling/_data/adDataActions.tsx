import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { notFound } from "next/navigation";
import { validate as uuidValidate } from "uuid";
import { type AdDTO, elasticHitToAdDTOResult } from "@/app/stillinger/_common/lib/ad-model";
import { bestEffortFromHit } from "@/app/stillinger/_common/lib/ad-model/bestEffortFromHit";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { appLogger } from "@/app/_common/logging/appLogger";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/stilling/[id]/_similarity_search/fetchElasticSearch";
import { cache } from "react";

import { SimilarAdsSearchQuery } from "@/app/stillinger/stilling/[id]/_similarity_search/elasticSimilaritySearchRequestBody";

// Expose only necessary data to client
const sourceIncludes = [
    "businessName",
    "contactList.email",
    "contactList.name",
    "contactList.phone",
    "contactList.title",
    "employer.name",
    "employer.orgnr",
    "expires",
    "id",
    "locationList.postalCode",
    "locationList.city",
    "locationList.address",
    "locationList.municipal",
    "locationList.county",
    "locationList.country",
    "medium",
    "properties.adtext",
    "properties.address",
    "properties.adtextFormat",
    "properties.applicationdue",
    "properties.applicationemail",
    "properties.applicationurl",
    "properties.employer",
    "properties.employerdescription",
    "properties.employerhomepage",
    "properties.engagementtype",
    "properties.extent",
    "properties.facebookpage",
    "properties.hasInterestform",
    "properties.jobarrangement",
    "properties.jobpercentage",
    "properties.jobpercentagerange",
    "properties.jobtitle",
    "properties.linkedinpage",
    "properties.location",
    "properties.positioncount",
    "properties.remote",
    "properties.sector",
    "properties.sourceurl",
    "properties.starttime",
    "properties.twitteraddress",
    "properties.workday",
    "properties.workhours",
    "properties.workLanguage",
    "published",
    "reference",
    "source",
    "status",
    "title",
    "updated",
    "compositeAdVector",
    "generatedSearchMetadata.shortSummary",
].join(",");
const ENABLE_BEST_EFFORT = process.env.ENABLE_ADDTO_BEST_EFFORT === "true";

/**
 * Returns a javascript object containing job posting data
 * @param id - the id of job posting
 * @returns Promise<Response<AdDTOSchema>>
 */
async function getAdDataUncached(id: string): Promise<AdDTO> {
    if (!uuidValidate(id)) {
        notFound();
    }

    const headers = await getDefaultHeaders();

    const startedAt = performance.now();
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/${id}?_source_includes=${sourceIncludes}`, {
        headers: headers,
        next: { revalidate: 60 },
    });
    const fetchedAt = performance.now();

    if (res.status === 404) {
        notFound();
    }

    if (!res.ok) {
        const errorMessage = `Hent stilling med id ${id} feilet`;
        const upstreamText = await res.text();
        appLogger.httpError(errorMessage, {
            method: "GET",
            url: res.url,
            status: res.status,
            statusText: upstreamText,
        });
        return Promise.reject(errorMessage);
    }

    let json: unknown;
    let parsedAt: number;
    try {
        json = await res.json();
        parsedAt = performance.now();
    } catch (error) {
        appLogger.errorWithCause(`Klarte ikke parse JSON for stilling [${id}]`, error);
        throw error; // rethrow her er OK – dette er ikke en “lokal throw”
    }

    const validatedData = elasticHitToAdDTOResult(json);
    const validatedAt = performance.now();

    appLogger.info("Timing for getAdData", {
        id,
        fetchMs: Math.round(fetchedAt - startedAt),
        jsonMs: Math.round(parsedAt - fetchedAt),
        validateTransformMs: Math.round(validatedAt - parsedAt),
        totalMs: Math.round(validatedAt - startedAt),
    });

    if (validatedData.ok) {
        return validatedData.data;
    }

    const parseError = validatedData.error;
    logZodError(parseError);

    if (ENABLE_BEST_EFFORT) {
        const fallback = bestEffortFromHit(json);
        if (fallback) {
            return fallback as AdDTO;
        }
    }
    throw new Error(`Validering av stilling feilet [${id}]: ${validatedData.error.summary}`);
}

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
        appLogger.info(`No compositeAdVector found for ad ${adData.id}, cannot perform similarity search.`);
        return undefined;
    } else if (similarAdQuery.counties === undefined && similarAdQuery.postcode === undefined) {
        appLogger.warn(`No location data found for ad ${adData.id}, check if correct.`);
    }

    const headers = await getDefaultHeaders();
    const searchResult = await fetchCachedSimplifiedElasticSearch(similarAdQuery, headers);
    return {
        ads: searchResult?.data?.ads?.filter((ad) => ad.uuid !== adId) || [],
        totalAds: searchResult?.data?.totalAds ? searchResult.data.totalAds - 1 : 0,
    };
}
export { getSimilarAds };

export const getAdData = cache(getAdDataUncached);
