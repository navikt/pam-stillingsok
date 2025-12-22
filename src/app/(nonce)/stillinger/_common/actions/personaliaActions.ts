"use server";

import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/(nonce)/stillinger/_common/auth/auth";
import logger from "@/app/(nonce)/stillinger/_common/utils/logger";
import { incrementAdUserRequests } from "@/metrics";

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
        logger.error(`GET personalia from aduser failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
}
