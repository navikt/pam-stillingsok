import { notFound } from "next/navigation";
import Ad from "./_components/Ad";
import { STILLINGSOK_URL } from "../../../_common/environment";
import { getStillingDescription, getStillingTitle } from "./_components/getMetaData";

async function fetchAd(id) {
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/stillinger/api/stilling/${id}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export async function generateMetadata({ params }) {
    const data = await fetchAd(params.id);

    return {
        title: getStillingTitle(data._source),
        description: getStillingDescription(data._source),
        openGraph: {
            title: getStillingTitle(data._source),
            description: getStillingDescription(data._source),
            images: [
                {
                    url: "https://arbeidsplassen.nav.no/images/arbeidsplassen-open-graph.png",
                    width: 1200,
                    height: 630,
                },
            ],
        },
    };
}

export default async function Page({ params }) {
    const ad = await fetchAd(params.id);

    // Todo: Sørg for at STILLINGSOK_URL variabel virker
    const shareAdRedirectUrl = `${STILLINGSOK_URL}/stilling/${params.id}`;

    return <Ad ad={ad} shareAdRedirectUrl={shareAdRedirectUrl} />;
}
