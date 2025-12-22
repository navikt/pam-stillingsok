"use server";

import { WithdrawResponse } from "@/app/(nonce)/stillinger/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import { getDefaultHeaders } from "@/app/(nonce)/stillinger/_common/utils/fetch";

export async function withdrawApplication(adUuid: string, uuid: string): Promise<WithdrawResponse> {
    try {
        const headers = await getDefaultHeaders();
        const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${adUuid}/application/${uuid}`, {
            method: "DELETE",
            headers: headers,
        });
        if (res.status !== 200 && res.status !== 204) {
            return {
                success: false,
                error: "unknown",
            };
        }
    } catch {
        return {
            success: false,
            error: "unknown",
        };
    }

    return {
        success: true,
    };
}
