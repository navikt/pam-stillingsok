import { notFound } from "next/navigation";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { ReactElement } from "react";
import * as actions from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/actions";
import { WithdrawResponse } from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import WithdrawApplication from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplication";
import { Metadata } from "@/app/stillinger/stilling/_data/types";
import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";

export const metadata: Metadata = {
    title: "Trekk søknad",
    robots: "noindex",
};

type PageProps = {
    params: Promise<{
        uuid: string;
        adUuid: string;
    }>;
};

async function fetchApplicationExists(adUuid: string, uuid: string): Promise<string> {
    const headers = await getDefaultHeaders();
    const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${adUuid}/application/${uuid}`, {
        method: "HEAD",
        cache: "no-store",
        headers: headers,
    });
    if (res.status === 410 || res.status === 404) {
        notFound();
    }
    return res.text();
}

export default async function Page(props: PageProps): Promise<ReactElement> {
    const params = await props.params;
    const { adUuid, uuid } = params;

    const stilling = await getAdData(adUuid);
    await fetchApplicationExists(adUuid, uuid);

    const handleWithdraw = async (): Promise<WithdrawResponse> => {
        "use server";

        return actions.withdrawApplication(adUuid, uuid);
    };
    return <WithdrawApplication stilling={stilling} onWithdrawApplication={handleWithdraw} />;
}
