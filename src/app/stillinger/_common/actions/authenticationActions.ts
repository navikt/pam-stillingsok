"use server";

import { getToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/stillinger/_common/auth/auth";
import { appLogger } from "@/app/_common/logging/appLogger";

interface Authentication {
    isAuthenticated: boolean;
    failure: boolean;
}

export async function checkIfAuthenticated(): Promise<Authentication> {
    try {
        const requestheaders = await headers();
        return await validateToken(getToken(requestheaders) as string)
            .then((validation) => ({ isAuthenticated: validation.ok, failure: false }))
            .catch(() => ({ isAuthenticated: false, failure: true }));
    } catch {
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
    } catch {
        return { userAgreementAccepted: false, failure: true };
    }

    const res = await fetch(`${process.env.PAMADUSER_URL}/api/v1/user`, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        appLogger.info("User agreement not accepted");
        return { userAgreementAccepted: false, failure: false };
    }

    return { userAgreementAccepted: true, failure: false };
}
