import React from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";
import {
    COUNTY_PARAM_NAME,
    JOB_CATEGORY_PARAM_NAME,
    MUNICIPAL_PARAM_NAME,
    SOMMERJOBB_SEARCH_RESULT_SIZE,
} from "@/app/sommerjobb/_utils/constants";
import MaxQuerySizeExceeded from "@/app/stillinger/(sok)/_components/maxQuerySizeExceeded/MaxQuerySizeExceeded";
import "./sommerjobb.css";
import { fetchSommerjobber } from "@/app/sommerjobb/_utils/fetchSommerjobber";
import mapFromUrlParamToJobCategories from "@/app/sommerjobb/_utils/mapFromUrlParamToJobCategories";
import { SommerjobbQuery } from "@/app/sommerjobb/_utils/types/SommerjobbQuery";
import { Metadata } from "next";
import { SearchParams } from "next/dist/server/request/search-params";
import { fetchLocations } from "@/app/_common/geografi/fetchLocations";
import {
    buildLocationAllowedList,
    sanitizeAndNormalizeLocationParams,
} from "@/app/_common/geografi/locationParamSanitizer";
import { adjustFromForBanner, calculateFrom, getPageNumber } from "@/app/sommerjobb/_utils/pagination";
import { getAllSearchParams, getSearchParam } from "@/app/_common/searchParams/searchParams";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

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

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams;

    const page = getPageNumber(searchParams);
    const baseFrom = calculateFrom(page);
    const from = adjustFromForBanner(baseFrom, page);

    if (from + SOMMERJOBB_SEARCH_RESULT_SIZE > 10000) {
        return <MaxQuerySizeExceeded goBackToSearchUrl="/sommerjobb" />;
    }

    const locationsResult = await fetchLocations();
    const locations = locationsResult.data;

    const allowedList = buildLocationAllowedList(locations);

    const municipalRaw = getSearchParam(searchParams, MUNICIPAL_PARAM_NAME) ?? null;
    const countyRaw = getSearchParam(searchParams, COUNTY_PARAM_NAME) ?? null;
    const under18Raw = getSearchParam(searchParams, QueryNames.UNDER18) ? ["true"] : null;

    const normalizedLocation = sanitizeAndNormalizeLocationParams(
        { county: countyRaw, municipal: municipalRaw },
        allowedList,
    );

    const query: SommerjobbQuery = {
        q: mapFromUrlParamToJobCategories(getAllSearchParams(searchParams, JOB_CATEGORY_PARAM_NAME)),
        from,
    };

    if (normalizedLocation.municipal) {
        query.municipal = normalizedLocation.municipal;

        if (normalizedLocation.county) {
            query.county = normalizedLocation.county;
        }
    } else if (normalizedLocation.county) {
        query.county = normalizedLocation.county;
    }

    if (under18Raw) {
        query.under18 = under18Raw;
    }

    // Custom logic: page 2 har færre annonser pga banner
    if (page === 2) {
        query.size = 13;
    }

    const searchResult = await fetchSommerjobber(query);
    const data = searchResult?.data ?? { ads: [], totalAds: 0, totalStillinger: 0 };

    return <Sommerjobb data={data} locations={locations} />;
}
