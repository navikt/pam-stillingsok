"use server";

import { getToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import logger from "@/app/stillinger/_common/utils/logger";
import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/stillinger/_common/auth/auth";

interface Authentication {
    isAuthenticated: boolean;
    failure: boolean;
}

export async function checkIfAuthenticated(): Promise<Authentication> {
    try {
        return await validateToken(<string>getToken(headers()))
            .then((validation) => ({ isAuthenticated: validation.ok, failure: false }))
            .catch(() => ({ isAuthenticated: false, failure: true }));
    } catch (_) {
        return { isAuthenticated: false, failure: true };
    }
}

interface UserAgreement {
    userAgreementAccepted: boolean;
    failure: boolean;
}

export async function checkIfUserAgreementIsAccepted(): Promise<UserAgreement> {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return { userAgreementAccepted: false, failure: true };
    }

    const res = await fetch(`${process.env.PAMADUSER_URL}/api/v1/user`, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.info("User agreement not accepted");
        return { userAgreementAccepted: false, failure: false };
    }

    return { userAgreementAccepted: true, failure: false };
}
