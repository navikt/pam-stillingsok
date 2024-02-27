import { notFound } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import WithdrawApplication from "./_components/WithdrawApplication";
import { getMetadataTitle } from "@/app/layout";
import { fetchAd } from "@/app/stilling/FetchAd";

export const metadata = {
    title: getMetadataTitle("Trekk søknad"),
    robots: "noindex",
};

async function fetchApplicationExists(adUuid, uuid) {
    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${adUuid}/application/${uuid}`, {
        method: "HEAD",
        cache: "no-store",
    });
    if (res.status === 410 || res.status === 404) {
        notFound();
    }
    return res.text();
}

export default async function Page({ params }) {
    const { adUuid, uuid } = params;
    const ad = await fetchAd(adUuid);
    await fetchApplicationExists(adUuid, uuid);

    async function withdrawApplication() {
        "use server";

        try {
            const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${adUuid}/application/${uuid}`, {
                method: "DELETE",
                headers: {
                    NAV_CALLID_FIELD: uuidv4(),
                },
            });

            if (res.status !== 200 && res.status !== 204) {
                return {
                    success: false,
                    error: "unknown",
                };
            }
        } catch (err) {
            return {
                success: false,
                error: "unknown",
            };
        }

        return {
            success: true,
        };
    }

    return <WithdrawApplication ad={ad} withdrawApplication={withdrawApplication} />;
}
