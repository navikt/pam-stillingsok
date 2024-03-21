import Ad from "./_components/Ad";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";
import { defaultOpenGraphImage } from "@/app/layout";
import { fetchAd } from "../FetchAd";
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
    const ad = await fetchAd(params.id);
    let applyPositionBgColor = "green";

    if (cookies().get("APPLY_JOB_BOX_COLOR")) {
        applyPositionBgColor = cookies().get("APPLY_JOB_BOX_COLOR").value;
    }

    return <Ad ad={ad} applyPositionBgColor={applyPositionBgColor} />;
}
