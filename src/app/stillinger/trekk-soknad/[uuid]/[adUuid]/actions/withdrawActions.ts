"use server";

import { validate as isValidUUID } from "uuid";
import { WithdrawResponse } from "@/app/stillinger/trekk-soknad/[uuid]/[adUuid]/_types/Responses";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

export async function withdrawApplication(adUuid: string, uuid: string): Promise<WithdrawResponse> {
    if (!isValidUUID(adUuid) || !isValidUUID(uuid)) {
        return { success: false, error: "unknown" };
    }

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
