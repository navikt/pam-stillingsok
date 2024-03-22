import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";
import { defaultOpenGraphImage } from "@/app/layout";
import { fetchAd } from "../FetchAd";
import { getAdData } from "@/app/stilling/_data/adDataActions";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

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
    if (!result.success) {
        if (result.error === "not_found") {
            notFound();
        } else {
            throw new Error("Could not retrieve ad data");
        }
    }

    // Get cookie for ad layout a b test and pass it to component
    let adLayoutVariant = "a";
    if (cookies().get("AD_LAYOUT_VARIANT")) {
        adLayoutVariant = cookies().get("AD_LAYOUT_VARIANT").value;
    }

    return <Ad adData={result.data} adLayoutVariant={adLayoutVariant} />;
}
