"use server";

import { WithdrawResponse } from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

export async function withdrawApplication(adUuid: string, uuid: string): Promise<WithdrawResponse> {
    try {
        const res = await fetch(`${process.env.INTEREST_API_URL}/application-form/${adUuid}/application/${uuid}`, {
            method: "DELETE",
            headers: getDefaultHeaders(),
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
