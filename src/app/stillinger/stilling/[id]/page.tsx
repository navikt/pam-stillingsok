import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import { cookies } from "next/headers";
import { Metadata } from "@/app/stillinger/stilling/_data/types";
import { ReactElement } from "react";
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

    const isFinn = response && response?.source && response.source.toLowerCase() === "finn";

    const title = response ? response?.title : undefined;
    const data = response || undefined;
    return {
        title: getStillingTitle(title),
        description: getStillingDescription(data),
        robots: response && data?.status !== "ACTIVE" ? "noindex" : "",
        alternates: {
            canonical: isFinn && data?.sourceUrl ? data?.sourceUrl : "",
        },
    };
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
    const response = await getAdData(params.id);

    const organizationNumber = getOrgCookie();

    return <Ad adData={response} organizationNumber={organizationNumber} />;
}
