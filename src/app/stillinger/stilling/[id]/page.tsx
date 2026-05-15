import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import type { SearchParams } from "next/dist/server/request/search-params";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { appLogger } from "@/app/_common/logging/appLogger";
import { ExperimentProvider } from "@/app/_experiments/client/ExperimentProvider";
import { getVariantMap } from "@/app/_experiments/server/getVariantMap";
import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import SimilarAdsFallback from "@/app/stillinger/stilling/[id]/_components/SimilarAdsFallback";
import SimilarAdsSection from "@/app/stillinger/stilling/[id]/_components/SimilarAdsSection";
import { resolveCanonical } from "@/app/stillinger/stilling/[id]/resolveCanonical";
import { fetchApplicationForm } from "@/app/stillinger/stilling/[id]/superrask-soknad";
import type { Qualification } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import Ad from "./_components/Ad";
import { getStillingTitle } from "./_components/getMetaData";

async function fetchQualifications(id: string): Promise<Qualification[] | undefined> {
    try {
        const applicationForm = await fetchApplicationForm(id);
        return applicationForm.qualifications;
    } catch (error) {
        appLogger.warnWithCause(`Kunne ikke hente kvalifikasjoner for stilling ${id}`, error);
        return undefined;
    }
}

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
    const variants = await getVariantMap(["qualifications_soek_superrask_cta"]);
    const qualifications =
        adData.application.hasSuperraskSoknad &&
        adData.status === "ACTIVE" &&
        variants.qualifications_soek_superrask_cta === "test"
            ? await fetchQualifications(params.id)
            : undefined;
    return (
        <PageBlock as="article" width="text" gutters>
            <ExperimentProvider variants={variants}>
                <Ad adData={adData} organizationNumber={organizationNumber} qualifications={qualifications} />
            </ExperimentProvider>
            <Suspense fallback={<SimilarAdsFallback />}>
                <SimilarAdsSection adData={adData} adId={params.id} explain={explain} />
            </Suspense>
        </PageBlock>
    );
}
