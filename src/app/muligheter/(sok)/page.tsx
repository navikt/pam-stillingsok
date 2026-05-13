import type { Metadata } from "next";
import type { SearchParams } from "next/dist/server/request/search-params";
import { notFound } from "next/navigation";
import { fetchLocations } from "@/app/_common/geografi/fetchLocations";
import {
    buildLocationAllowedList,
    sanitizeAndNormalizeLocationParams,
} from "@/app/_common/geografi/locationParamSanitizer";
import { appLogger } from "@/app/_common/logging/appLogger";
import { getAllSearchParams, getSearchParam } from "@/app/_common/searchParams/searchParams";
import { checkMuligheterAccess } from "@/app/muligheter/_common/auth/checkAccess.server";
import {
    COUNTY_PARAM_NAME,
    JOB_CATEGORY_PARAM_NAME,
    MULIGHETER_SEARCH_RESULT_SIZE,
    MUNICIPAL_PARAM_NAME,
} from "@/app/muligheter/(sok)/_utils/constants";
import { fetchMuligheter } from "@/app/muligheter/(sok)/_utils/fetchMuligheter";
import { calculateFrom, getPageNumber } from "@/app/muligheter/(sok)/_utils/pagination";
import type { MulighetQuery } from "@/app/muligheter/(sok)/_utils/types/MulighetQuery";
import Muligheter from "@/app/muligheter/(sok)/Muligheter";
import MaxQuerySizeExceeded from "@/app/stillinger/(sok)/_components/maxQuerySizeExceeded/MaxQuerySizeExceeded";

export const metadata: Metadata = {
    title: "Reserverte stillinger",
    description: "Stillinger reservert for deg under oppfølging av Nav.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
    if (process.env.MULIGHETER_ENABLED !== "true") {
        appLogger.warn("Muligheter error - Har prøvd å aksessere /muligheter, men feature er deaktivert.");
        notFound();
    }

    const hasAccess = await checkMuligheterAccess();
    if (!hasAccess) {
        notFound();
    }

    const searchParams = await props.searchParams;

    const page = getPageNumber(searchParams);
    const from = calculateFrom(page);

    if (from + MULIGHETER_SEARCH_RESULT_SIZE > 10000) {
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
        q: getAllSearchParams(searchParams, JOB_CATEGORY_PARAM_NAME),
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

    const searchResult = await fetchMuligheter(query);
    const data = searchResult?.data ?? { ads: [], totalAds: 0, totalStillinger: 0 };

    return <Muligheter data={data} locations={locations} />;
}
