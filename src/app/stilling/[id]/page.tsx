import { getAdData } from "@/app/stilling/_data/adDataActions";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "@/app/stilling/_data/types";
import { ReactElement } from "react";
import { defaultOpenGraphImage } from "@/constants/layout";
import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";

const getOrgCookie = (): string | undefined => {
    try {
        return cookies().get("organizationNumber")?.value;
    } catch (err) {
        return undefined;
    }
};
type PageProps = {
    params: {
        id: string;
    };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const response = await getAdData(params.id);

    const isFinn = response.success && response.data?.source && response.data.source.toLowerCase() === "finn";

    const title = response.success ? response.data?.title : undefined;
    const data = response.success ? response.data : undefined;
    return {
        title: getStillingTitle(title),
        description: getStillingDescription(data),
        openGraph: {
            title: getStillingTitle(title),
            description: getStillingDescription(data),
            images: [defaultOpenGraphImage],
        },
        robots: response && data?.status !== "ACTIVE" ? "noindex" : "",
        alternates: {
            canonical: isFinn && data?.sourceUrl?.url ? data?.sourceUrl.url : "",
        },
    };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
    const response = await getAdData(params.id);

    if (!response.success) {
        if (response.status === 404) {
            notFound();
        }
        throw response.error;
    }
    const organizationNumber = getOrgCookie();

    return <Ad adData={response.data} organizationNumber={organizationNumber} />;
}
