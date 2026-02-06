import React, { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";
import { fetchCachedPostcodes, Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import {
    DISTANCE_PARAM_NAME,
    JOB_CATEGORY_PARAM_NAME,
    PAGE_PARAM_NAME,
    POSTCODE_PARAM_NAME,
    SOMMERJOBB_SEARCH_RESULT_SIZE,
} from "@/app/sommerjobb/_utils/constants";
import MaxQuerySizeExceeded from "@/app/stillinger/(sok)/_components/maxQuerySizeExceeded/MaxQuerySizeExceeded";
import "./sommerjobb.css";
import { fetchSommerjobber } from "@/app/sommerjobb/_utils/fetchSommerjobber";
import mapFromUrlParamToJobCategories from "@/app/sommerjobb/_utils/mapFromUrlParamToJobCategories";
import { SommerjobbQuery } from "@/app/sommerjobb/_utils/types/SommerjobbQuery";
import { getDistanceValueOrDefault } from "@/app/sommerjobb/_utils/getDistanceValueOrDefault";
import { Metadata } from "next";
import { SearchParams } from "next/dist/server/request/search-params";

function calculateFrom(param: string | string[] | undefined): number {
    const value: string | undefined = Array.isArray(param) ? param[0] : param || "0";
    const from = Number.parseInt(value, 10);
    return Number.isInteger(from) && from > 0 ? SOMMERJOBB_SEARCH_RESULT_SIZE * (from - 1) : 0;
}

/**
 * TODO: Kan disse funksjonene flyttes til en felles utils-fil?
 */
function getSearchParam(searchParams: Record<string, string | string[] | undefined>, key: string): string | undefined {
    return Array.isArray(searchParams[key]) ? searchParams[key][0] : searchParams[key];
}

function getAllSearchParams(searchParams: Record<string, string | string[] | undefined>, key: string): string[] {
    const value = searchParams[key];
    if (value == null) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

export const metadata: Metadata = {
    title: `Sommerjobben ${new Date().getFullYear()}`,
    description: "Kafé i Lofoten, butikk i Tromsø eller utendørs jobb i Oslo? Sikre sommereventyret i dag!",
    openGraph: {
        images: [
            {
                url: "https://arbeidsplassen.nav.no/images/sommerjobb-2026.png",
                width: 1200,
                height: 630,
            },
        ],
    },
};

export default async function Page(props: { searchParams: Promise<SearchParams> }): Promise<ReactElement> {
    const searchParams = await props.searchParams;
    let from = calculateFrom(searchParams[PAGE_PARAM_NAME]);

    // Custom logic to adjust number of ads to make space for banner to karriereveiledning.no
    const page = parseInt(
        Array.isArray(searchParams[PAGE_PARAM_NAME])
            ? searchParams[PAGE_PARAM_NAME][0] || "1"
            : searchParams[PAGE_PARAM_NAME] || "1",
    );

    if (page > 2) {
        from = from - 1;
    }
    // End custom logic

    if (from + SOMMERJOBB_SEARCH_RESULT_SIZE > 10000) {
        return <MaxQuerySizeExceeded goBackToSearchUrl="/sommerjobb" />;
    }

    let postcodes: Postcode[] = [];

    try {
        const postcodesResult = await fetchCachedPostcodes();
        postcodes = postcodesResult.data || [];
    } catch {
        postcodes = [];
    }

    const query: SommerjobbQuery = {
        q: mapFromUrlParamToJobCategories(getAllSearchParams(searchParams, JOB_CATEGORY_PARAM_NAME)),
        from: from,
    };

    const postcode = getSearchParam(searchParams, POSTCODE_PARAM_NAME);
    const postcodePattern = /^[0-9]{4}$/;

    if (postcode && postcodePattern.test(postcode)) {
        query.postcode = postcode;
        query.distance = getDistanceValueOrDefault(getSearchParam(searchParams, DISTANCE_PARAM_NAME));
    }

    // Custom logic to adjust number of ads to make space for banner to karriereveiledning.no
    if (page === 2) {
        query.size = 13;
    }
    // End custom logic

    const searchResult = await fetchSommerjobber(query);

    // husky klager om at searchResult kan være undefined
    const data = searchResult?.data || { ads: [], totalAds: 0, totalStillinger: 0 };

    return <Sommerjobb data={data} postcodes={postcodes} />;
}
