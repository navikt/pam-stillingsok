import { notFound } from "next/navigation";
import AdWrapper from "./_components/AdWrapper";

async function getData(id) {
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/stillinger/api/stilling/${id}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function Page({ params }) {
    const ad = await getData(params.id);

    return <AdWrapper ad={ad} shareAdRedirectUrl="https://arbeidsplassen.nav.no/todo" />;
}
