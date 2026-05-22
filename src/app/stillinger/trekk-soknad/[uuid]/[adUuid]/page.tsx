import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { validate as isValidUUID } from "uuid";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { getAdData } from "@/app/stillinger/stilling/_data/adDataActions";
import WithdrawApplication from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_components/WithdrawApplication";
import type { WithdrawResponse } from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import * as actions from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/actions";

export const metadata: Metadata = {
    title: "Trekk søknad",
    robots: "noindex",
};

type PageProps = {
    params: Promise<{
        uuid: string;
        adUuid: string;
    }>;
    searchParams: Promise<{
        from?: string;
    }>;
};

async function fetchApplicationExists(adUuid: string, uuid: string): Promise<string> {
    if (!isValidUUID(adUuid) || !isValidUUID(uuid)) {
        notFound();
    }

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

export default async function Page(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const { adUuid, uuid } = params;

    const stilling = await getAdData(adUuid);
    await fetchApplicationExists(adUuid, uuid);

    const handleWithdraw = async (): Promise<WithdrawResponse> => {
        "use server";

        return actions.withdrawApplication(adUuid, uuid);
    };
    return <WithdrawApplication stilling={stilling} onWithdrawApplication={handleWithdraw} from={searchParams.from} />;
}
