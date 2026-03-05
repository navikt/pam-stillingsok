"use server";

import { incrementAdUserRequests } from "@/metrics";
import { appLogger } from "@/app/_common/logging/appLogger";
import { getAduserRequestHeaders } from "@/app/_common/auth/aduserAuth.server";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

const ADUSER_PERSONALIA_URL = `${process.env.PAMADUSER_URL}/api/v1/personalia`;

export async function getPersonalia() {
    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "none", baseHeaders });

    if (!auth.ok) {
        return { success: false };
    }

    const res = await fetch(ADUSER_PERSONALIA_URL, {
        method: "GET",
        headers: auth.headers,
        cache: "no-store",
    });

    incrementAdUserRequests("get_personalia", res.ok);

    if (!res.ok) {
        appLogger.httpError("GET personalia from aduser failed.", {
            method: "GET",
            url: res.url,
            status: res.status,
            statusText: res.statusText,
        });
        return { success: false };
    }

    const data: unknown = await res.json();
    return { success: true, data };
}
