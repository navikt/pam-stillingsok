import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import { cookies } from "next/headers";
import Ad from "./_components/Ad";
import { getStillingTitle } from "./_components/getMetaData";

import { SearchParams } from "next/dist/server/request/search-params";
import { resolveCanonical } from "@/app/stillinger/stilling/[id]/resolveCanonical";
import { Metadata } from "next";
import { Suspense } from "react";
import SimilarAdsSection from "@/app/stillinger/stilling/[id]/_components/SimilarAdsSection";
import SimilarAdsFallback from "@/app/stillinger/stilling/[id]/_components/SimilarAdsFallback";
import { PageBlock } from "@navikt/ds-react/Page";

const getOrgCookie = async (): Promise<string | undefined> => {
    try {
        const requestCookies = await cookies();
        return requestCookies.get("organizationNumber")?.value;
    } catch {
        return undefined;
    }
};
type Params = Promise<{ id: string }>;

type PageProps = {
    params: Params;
    searchParams: Promise<SearchParams>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const response = await getAdData(params.id);

    const sourceLower = response?.source?.toLowerCase() ?? "";
    const canonical = resolveCanonical({
        sourceLower,
        sourceUrl: response?.sourceUrl,
        adId: params.id,
    });

    const robots: Metadata["robots"] = response?.status !== "ACTIVE" ? "noindex" : undefined;

    return {
        title: getStillingTitle(response.title),
        description: response.shortSummary,
        robots,
        alternates: {
            canonical: canonical ? canonical : undefined,
        },
    };
}

export default async function Page(props: PageProps) {
    const params = await props.params;

    const adDataPromise = getAdData(params.id);
    const organizationNumberPromise = getOrgCookie();
    const searchParamsPromise = props.searchParams;

    const [adData, organizationNumber, searchParams] = await Promise.all([
        adDataPromise,
        organizationNumberPromise,
        searchParamsPromise,
    ]);
    const explain = searchParams?.explain === "true";
    return (
        <PageBlock as="article" width="text" gutters>
            <Ad adData={adData} organizationNumber={organizationNumber} />
            <Suspense fallback={<SimilarAdsFallback />}>
                <SimilarAdsSection adData={adData} adId={params.id} explain={explain} />
            </Suspense>
        </PageBlock>
    );
}
