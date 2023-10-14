import { notFound } from "next/navigation";
import AdWrapper from "../../../../migrating/use-client/AdWrapper";
import { getStillingDescription, getStillingTitle } from "../../../../../server/common/htmlMeta";

async function getData(id) {
    const res = await fetch(`http://localhost:3000/stillinger/api/stilling/${id}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export async function generateMetadata({ params }) {
    const data = await getData(params.id);

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
    const ad = await getData(params.id);

    return <AdWrapper ad={ad} shareAdRedirectUrl="https://arbeidsplassen.nav.no/todo" />;
}
