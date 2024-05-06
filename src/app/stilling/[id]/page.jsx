import { defaultOpenGraphImage } from "@/app/layout";
import { getAdData } from "@/app/stilling/_data/adDataActions";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";
import { fetchAd } from "../FetchAd";

const getOrgCookie = () => {
    try {
        const orgNr = cookies().get("organizationNumber").value;
        return orgNr;
    } catch (err) {
        return undefined;
    }
};

export async function generateMetadata({ params }) {
    const data = await fetchAd(params.id);
    const isFinn = data._source && data._source.source && data._source.source.toLowerCase() === "finn";

    return {
        title: getStillingTitle(data._source),
        description: getStillingDescription(data._source),
        openGraph: {
            title: getStillingTitle(data._source),
            description: getStillingDescription(data._source),
            images: [defaultOpenGraphImage],
        },
        robots: data && data._source.status !== "ACTIVE" ? "noindex" : "",
        alternates: {
            canonical: isFinn ? data._source.properties.sourceurl : "",
        },
    };
}

export default async function Page({ params }) {
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
