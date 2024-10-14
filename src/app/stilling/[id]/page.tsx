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
    const isFinn = response && response.data?.source && response.data.source.toLowerCase() === "finn";

    return {
        title: getStillingTitle(response.data?.title),
        description: getStillingDescription(response.data),
        openGraph: {
            title: getStillingTitle(response.data?.title),
            description: getStillingDescription(response.data),
            images: [defaultOpenGraphImage],
        },
        robots: response && response.data?.status !== "ACTIVE" ? "noindex" : "",
        alternates: {
            canonical: isFinn && response.data?.sourceUrl?.url ? response.data?.sourceUrl.url : "",
        },
    };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
    const result = await getAdData(params.id);

    const organizationNumber = getOrgCookie();

    if (!result.ok) {
        if (result.status === 404) {
            notFound();
        } else {
            throw new Error("Could not retrieve ad data");
        }
    }

    return <Ad adData={result.data} organizationNumber={organizationNumber} />;
}
