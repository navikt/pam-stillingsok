import { notFound } from "next/navigation";
import { getStillingDescription, getStillingTitle } from "../../../../../server/common/htmlMeta";
import Ad from "./_components/Ad";

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
        },
    };
}

export default async function Page({ params }) {
    const ad = await fetchAd(params.id);

    return <Ad ad={ad} shareAdRedirectUrl="https://arbeidsplassen.nav.no/todo" />;
}
