"use server";

import { getToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import logger from "@/app/_common/utils/logger";
import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/_common/auth/auth";

export async function checkIfAuthenticated() {
    return await validateToken(getToken(headers()))
        .then((token) => {
            return { isAuthenticated: token.ok };
        })
        .catch(() => {
            return { isAuthenticated: false };
        });
}

export async function checkIfUserAgreementIsAccepted() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return new Response(null, { status: 401 });
    }

    const res = await fetch(`${process.env.PAMADUSER_URL}/api/v1/personalia`, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.info("User agreement not accepted");
        return { userAgreementAccepted: false };
    }

    return { userAgreementAccepted: true };
}
