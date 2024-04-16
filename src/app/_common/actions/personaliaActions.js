"use server";

import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/_common/auth/auth";
import logger from "@/app/_common/utils/logger";

const ADUSER_PERSONALIA_URL = `${process.env.PAMADUSER_URL}/api/v1/personalia`;

export async function getPersonalia() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return { success: false };
    }

    const res = await fetch(ADUSER_PERSONALIA_URL, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.error(`GET personalia from aduser failed. ${res.status} ${res.statusText}`);
        return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
}
