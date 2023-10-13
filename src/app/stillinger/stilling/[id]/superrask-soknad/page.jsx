import { notFound } from "next/navigation";
import NewApplicationWrapper from "./_components/NewApplicationWrapper";

async function getAd(id) {
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/stillinger/api/stilling/${id}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

async function getApplicationForm(id) {
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/interesse-api/application-form/${id}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function Page({ params }) {
    const ad = await getAd(params.id);
    const applicationForm = await getApplicationForm(params.id);

    return <NewApplicationWrapper ad={ad} applicationForm={applicationForm} />;
}
