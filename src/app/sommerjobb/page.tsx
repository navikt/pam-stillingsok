import React, { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";
import { fetchCachedPostcodes, Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { getMetadataTitle } from "@/app/metadata";
import {
    DISTANCE_PARAM_NAME,
    JOB_CATEGORY_PARAM_NAME,
    PAGE_PARAM_NAME,
    POSTCODE_PARAM_NAME,
    SOMMERJOBB_SEARCH_RESULT_SIZE,
} from "@/app/sommerjobb/_components/constants";
import { Button, VStack } from "@navikt/ds-react";
import MaxQuerySizeExceeded from "@/app/stillinger/_common/components/MaxQuerySizeExceeded";
import Link from "next/link";
import "./sommerjobb.css";
import { fetchSommerjobber } from "@/app/sommerjobb/_utils/fetchSommerjobber";
import mapFromUrlParamToJobCategories from "@/app/sommerjobb/_utils/mapFromUrlParamToJobCategories";
import { SommerjobbQuery } from "@/app/sommerjobb/_utils/types/SommerjobbQuery";
import { getDistanceValueOrDefault } from "@/app/sommerjobb/_utils/getDistanceValueOrDefault";

function calculateFrom(param: string | string[] | undefined): number {
    const value: string | undefined = Array.isArray(param) ? param[0] : param || "0";
    const from = Number.parseInt(value, 10);
    return Number.isInteger(from) && from > 0 ? SOMMERJOBB_SEARCH_RESULT_SIZE * (from - 1) : 0;
}

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

export async function generateMetadata() {
    const pageTitle = getMetadataTitle("Sommerjobben 2025");
    const description = "Kafé i Lofoten, butikk i Tromsø eller utendørs jobb i Oslo? Sikre sommereventyret i dag!";
    return {
        title: pageTitle,
        description: description,
        openGraph: {
            title: pageTitle,
            description: description,
            images: [
                {
                    url: "https://arbeidsplassen.nav.no/images/sommerjobb-open-graph.png",
                    width: 1200,
                    height: 630,
                },
            ],
        },
    };
}

export default async function Page({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>;
}): Promise<ReactElement> {
    const from = calculateFrom(searchParams[PAGE_PARAM_NAME]);

    if (from + SOMMERJOBB_SEARCH_RESULT_SIZE > 10000) {
        return (
            <VStack align="center" className="mb-24">
                <MaxQuerySizeExceeded />
                <Button variant="primary" as={Link} role="link" href="/sommerjobb">
                    Gå tilbake
                </Button>
            </VStack>
        );
    }

    let postcodes: Postcode[];

    try {
        const postcodesResult = await fetchCachedPostcodes();
        postcodes = postcodesResult.data || [];
    } catch (e) {
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

    const searchResult = await fetchSommerjobber(query);

    // husky klager om at searchResult kan være undefined
    const data = searchResult?.data || { ads: [], totalAds: 0 };

    return <Sommerjobb data={data} postcodes={postcodes} />;
}
