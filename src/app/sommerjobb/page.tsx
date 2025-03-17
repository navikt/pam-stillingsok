import React, { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";
import { fetchCachedPostcodes, Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { getMetadataTitle } from "@/app/metadata";
import { asArray } from "@/app/stillinger/(sok)/_utils/query";
import {
    DEFAULT_DISTANCE,
    JOB_CATEGORY_PARAM_NAME,
    PAGE_PARAM_NAME,
    SOMMERJOBB_SEARCH_RESULT_SIZE,
} from "@/app/sommerjobb/_components/constants";
import { Button, VStack } from "@navikt/ds-react";
import MaxQuerySizeExceeded from "@/app/stillinger/_common/components/MaxQuerySizeExceeded";
import Link from "next/link";
import "./sommerjobb.css";
import { fetchSommerjobber } from "@/app/sommerjobb/_utils/fetchSommerjobber";
import mapFromUrlParamToJobCategories from "@/app/sommerjobb/_utils/mapFromUrlParamToJobCategories";

function calculateFrom(param: string | string[] | undefined): number {
    const value: string | undefined = Array.isArray(param) ? param[0] : param || "0";
    const from = Number.parseInt(value, 10);
    return Number.isInteger(from) && from >= 0 ? SOMMERJOBB_SEARCH_RESULT_SIZE * (from - 1) : 0;
}

type SommerjobbQuery = {
    q: string[];
    from: number;
    postcode?: string;
    distance?: string;
};

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

    const postcode = Array.isArray(searchParams.postcode) ? searchParams.postcode[0] : searchParams.postcode;
    const distance = Array.isArray(searchParams.distance) ? searchParams.distance[0] : searchParams.distance;

    const query: SommerjobbQuery = {
        q: mapFromUrlParamToJobCategories(asArray(searchParams[JOB_CATEGORY_PARAM_NAME]) || []),
        from: from,
    };

    if (postcode) {
        query.postcode = postcode;
        query.distance = distance || DEFAULT_DISTANCE.toString();
    }

    const searchResult = await fetchSommerjobber(query);

    // husky klager om at searchResult kan være undefined
    const data = searchResult?.data || { ads: [], totalAds: 0 };

    return <Sommerjobb data={data} postcodes={postcodes} />;
}
