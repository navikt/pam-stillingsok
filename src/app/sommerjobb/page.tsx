import React, { ReactElement } from "react";
import Sommerjobb from "@/app/sommerjobb/_components/Sommerjobb";
import { fetchCachedPostcodes, Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { getMetadataTitle } from "@/app/metadata";
import { asArray, createQuery, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";
import {
    JOB_CATEGORY_PARAM_NAME,
    PAGE_PARAM_NAME,
    SOMMERJOBB_SEARCH_RESULT_SIZE,
    DEFAULT_DISTANCE,
} from "@/app/sommerjobb/_components/constants";
import { Button, VStack } from "@navikt/ds-react";
import MaxQuerySizeExceeded from "@/app/stillinger/_common/components/MaxQuerySizeExceeded";
import Link from "next/link";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { CURRENT_VERSION } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import "./sommerjobb.css";

/*
const SommerjobbKeywords = {
    SOMMERJOBB: ["Sommerjobb", "Sommervikar", "Sesongarbeid"],
    BUTIKK: ["Butikk", "Salg", "Detaljhandel"],
    HELSE: ["Helse", "Sykepleier", "Lege"],
    KONTOR: ["Kontor", "Administrasjon", "Sekretær"],
    KULTUR: ["Kultur", "Kunst", "Musikk"],
    KUNDESERVICE: ["Kundeservice", "Support", "Kundebehandling"],
    LAGER_OG_INDUSTRI: ["Lager", "Industri", "Produksjon"],
    RENHOLD: ["Renhold", "Vask", "Rengjøring"],
    RESTAURANT_OG_KAFE: ["Restaurant", "Kafé", "Servering"],
    TRANSPORT: ["Transport", "Sjåfør", "Logistikk"],
    TURISME: ["Turisme", "Reise", "Guide"],
    UTENDORS: ["Utendørs", "Friluft"],
};
 */

function calculateFrom(pageParam: string | string[] | undefined): number {
    const parsedPageParam = pageParam ? parseInt(asArray(pageParam)[0]) : 1;
    return Number.isInteger(parsedPageParam) ? SOMMERJOBB_SEARCH_RESULT_SIZE * (parsedPageParam - 1) : 0;
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
    let postcodes: Postcode[];

    try {
        const postcodesResult = await fetchCachedPostcodes();
        postcodes = postcodesResult.data || [];
    } catch (e) {
        postcodes = [];
    }

    const sommerjobbKeyword = "sommerjobb";
    const jobCategories: string[] = asArray(searchParams[JOB_CATEGORY_PARAM_NAME]).map(
        (it) => `${it} ${sommerjobbKeyword}`,
    );
    const searchKeywords: string[] = jobCategories.length > 0 ? jobCategories : [sommerjobbKeyword];

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

    const searchResult = await fetchCachedSimplifiedElasticSearch(
        toApiQuery(
            createQuery({
                ...searchParams,
                distance: searchParams.distance || DEFAULT_DISTANCE.toString(),
                from: `${from}`,
                size: `${SOMMERJOBB_SEARCH_RESULT_SIZE}`,
                q: searchKeywords,
                v: `${CURRENT_VERSION}`,
            }),
        ),
    );

    /**
     * For testing, men merk at alle søkeord bruker OR operator akkurat nå.
     * searchKeywords = Array.from(new Set([...searchKeywords, ...SommerjobbKeywords.UTENDØRS])) // Legger til utendørs
     * searchKeywords = searchKeywords.filter(word => !SommerjobbKeywords.TURISME.includes(word)); // Fjerner turisme søkeord
     */

    const ads: SommerjobbAd[] =
        searchResult?.data?.ads.map((ad) => ({
            uuid: ad.uuid,
            title: ad.title,
            description: ad.description || "",
            employer: {
                name: ad.employer.name || "",
            },
            location: getWorkLocation(undefined, ad.locationList),
            applicationDue: ad.applicationDue || "",
        })) || [];

    const data = {
        ads: ads,
        totalAds: searchResult?.data?.totalAds || 0,
    };

    return <Sommerjobb data={data} postcodes={postcodes} />;
}
