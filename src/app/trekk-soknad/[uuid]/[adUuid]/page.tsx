import { notFound } from "next/navigation";
import { getMetadataTitle } from "@/constants/layout";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import { ReactElement } from "react";
import * as actions from "@/app/trekk-soknad/[uuid]/[adUuid]/actions";
import { WithdrawResponse } from "@/app/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import WithdrawApplication from "@/app/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplication";
import { Metadata } from "@/app/stilling/_data/types";
import { getAdData } from "@/app/stilling/_data/adDataActions";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: getMetadataTitle("Trekk søknad"),
        robots: "noindex",
    };
}

type PageProps = {
    params: {
        uuid: string;
        adUuid: string;
    };
};

async function fetchApplicationExists(adUuid: string, uuid: string): Promise<string> {
    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${adUuid}/application/${uuid}`, {
        method: "HEAD",
        cache: "no-store",
        headers: getDefaultHeaders(),
    });
    if (res.status === 410 || res.status === 404) {
        notFound();
    }
    return res.text();
}

export default async function Page({ params }: PageProps): Promise<ReactElement> {
    const { adUuid, uuid } = params;

    const stilling = await getAdData(adUuid);
    await fetchApplicationExists(adUuid, uuid);

    const handleWithdraw = async (): Promise<WithdrawResponse> => {
        "use server";

        return actions.withdrawApplication(adUuid, uuid);
    };
    return <WithdrawApplication stilling={stilling} onWithdrawApplication={handleWithdraw} />;
}
