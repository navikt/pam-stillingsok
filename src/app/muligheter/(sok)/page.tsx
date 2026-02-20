import React from "react";
import {
    COUNTY_PARAM_NAME,
    MUNICIPAL_PARAM_NAME,
    SOMMERJOBB_SEARCH_RESULT_SIZE,
} from "@/app/sommerjobb/_utils/constants";
import MaxQuerySizeExceeded from "@/app/stillinger/(sok)/_components/maxQuerySizeExceeded/MaxQuerySizeExceeded";
import "./muligheter.css";
import { Metadata } from "next";
import { SearchParams } from "next/dist/server/request/search-params";
import { fetchLocations } from "@/app/_common/geografi/fetchLocations";
import {
    buildLocationAllowedList,
    sanitizeAndNormalizeLocationParams,
} from "@/app/_common/geografi/locationParamSanitizer";
import { adjustFromForBanner, calculateFrom, getPageNumber } from "@/app/sommerjobb/_utils/pagination";
import { getAllSearchParams, getSearchParam } from "@/app/_common/searchParams/searchParams";
import { getDirApiOboHeaders } from "@/app/muligheter/_common/auth/auth";
import { notFound } from "next/navigation";
import { fetchMuligheter } from "@/app/muligheter/(sok)/_utils/fetchMuligheter";
import { MulighetQuery } from "@/app/muligheter/(sok)/_utils/types/MulighetQuery";
import Muligheter from "@/app/muligheter/(sok)/Muligheter";

export const metadata: Metadata = {
    title: "Muligheter",
    description: "Muligheter for deg under oppfølging av Nav.",
    robots: "noindex, nofollow",
};

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams;

    const page = getPageNumber(searchParams);
    const baseFrom = calculateFrom(page);
    const from = adjustFromForBanner(baseFrom, page);

    if (from + SOMMERJOBB_SEARCH_RESULT_SIZE > 10000) {
        return <MaxQuerySizeExceeded goBackToSearchUrl="/muligheter" />;
    }

    const locationsResult = await fetchLocations();
    const locations = locationsResult.data;

    const allowedList = buildLocationAllowedList(locations);

    const municipalRaw = getSearchParam(searchParams, MUNICIPAL_PARAM_NAME) ?? null;
    const countyRaw = getSearchParam(searchParams, COUNTY_PARAM_NAME) ?? null;

    const normalizedLocation = sanitizeAndNormalizeLocationParams(
        { county: countyRaw, municipal: municipalRaw },
        allowedList,
    );

    const query: MulighetQuery = {
        q: getAllSearchParams(searchParams, "occupationLevel1"),
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

    let headers;

    try {
        headers = await getDirApiOboHeaders();
    } catch {
        notFound();
    }

    const searchResult = await fetchMuligheter(query, headers);
    const data = searchResult?.data ?? { ads: [], totalAds: 0, totalStillinger: 0 };

    return <Muligheter data={data} locations={locations} />;
}
