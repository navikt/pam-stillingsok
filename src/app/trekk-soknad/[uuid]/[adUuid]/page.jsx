import { notFound } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import WithdrawApplication from "./_components/WithdrawApplication";
import { excludes } from "../../../stilling/[id]/page";

export const metadata = {
    title: "Trekk søknad - arbeidsplassen.no",
};

async function getAd(id) {
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/ad/${id}?_source_excludes=${excludes}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

async function getApplicationStatus(adUuid, uuid) {
    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${adUuid}/application/${uuid}`, {
        method: "HEAD",
    });
    if (res.status === 410 || res.status === 404) {
        notFound();
    }
    return res.text();
}

export default async function Page({ params }) {
    const { adUuid, uuid } = params;
    const ad = await getAd(adUuid);
    await getApplicationStatus(adUuid, uuid);

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
