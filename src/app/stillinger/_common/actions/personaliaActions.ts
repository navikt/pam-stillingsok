"use server";

import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/stillinger/_common/auth/auth";
import { incrementAdUserRequests } from "@/metrics";
import { appLogger } from "@/app/_common/logging/appLogger";

const ADUSER_PERSONALIA_URL = `${process.env.PAMADUSER_URL}/api/v1/personalia`;

export async function getPersonalia() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch {
        return { success: false };
    }

    const res = await fetch(ADUSER_PERSONALIA_URL, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    incrementAdUserRequests("get_personalia", res.ok);

    if (!res.ok) {
        appLogger.httpError(`GET personalia from aduser failed.`, {
            method: "GET",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
}
