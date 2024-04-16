"use server";

import { getToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import logger from "@/app/_common/utils/logger";
import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/_common/auth/auth";

export async function checkIfAuthenticated() {
    try {
        return await validateToken(getToken(headers()))
            .then((validation) => ({ isAuthenticated: validation.ok, failure: false }))
            .catch(() => ({ isAuthenticated: false, failure: true }));
    } catch (_) {
        return { isAuthenticated: false, failure: true };
    }
}

export async function checkIfUserAgreementIsAccepted() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return new Response(null, { status: 401 });
    }

    const res = await fetch(`${process.env.PAMADUSER_URL}/api/v1/user`, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.info("User agreement not accepted");
        return { userAgreementAccepted: false };
    }

    return { userAgreementAccepted: true };
}
