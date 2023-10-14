import { notFound } from "next/navigation";
import WithdrawApplicationWrapper from "../../../../../migrating/use-client/WithdrawApplicationWrapper";

export const metadata = {
    title: "Trekk søknad - arbeidsplassen.no",
};

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
async function getApplicationnStatus(uuid, adUuid) {
    const res = await fetch(
        `https://arbeidsplassen.intern.dev.nav.no/interesse-api/application-form/${uuid}/application/${adUuid}`,
        {
            method: "HEAD",
        },
    );
    if (res.status === 410) {
        notFound();
    }
    return res.text();
}

export default async function Page({ params }) {
    const ad = await getAd(params.adUuid);
    await getApplicationnStatus(params.uuid, params.adUuid);

    return <WithdrawApplicationWrapper ad={ad} />;
}
