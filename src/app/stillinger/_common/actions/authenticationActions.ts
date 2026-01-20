"use server";

import { getToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import logger from "@/app/stillinger/_common/utils/logger";
import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/stillinger/_common/auth/auth";

interface Authentication {
    isAuthenticated: boolean;
    failure: boolean;
}

interface ValidJobSeeker {
    isValidJobSeeker: boolean;
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

// TODO: Bruk nytt API for å sjekke om bruker skal ha tilgang til direktemeldte stillinger
export async function checkIfValidJobSeeker(): Promise<ValidJobSeeker> {
    try {
        const requestheaders = await headers();
        const token = getToken(requestheaders) as string;
        return await validateToken(token)
            .then((validation) => ({
                isValidJobSeeker: validation.ok,
                failure: false,
            }))
            .catch(() => ({ isValidJobSeeker: false, failure: true }));
    } catch {
        return { isValidJobSeeker: false, failure: true };
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
        logger.info("User agreement not accepted");
        return { userAgreementAccepted: false, failure: false };
    }

    return { userAgreementAccepted: true, failure: false };
}
