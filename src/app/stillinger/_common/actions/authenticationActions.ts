"use server";

import { getToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { appLogger } from "@/app/_common/logging/appLogger";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { isTokenValid } from "@/app/_common/auth/auth.server";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { getAduserRequestHeaders } from "@/app/_common/auth/aduserAuth.server";

type Authentication = Readonly<{
    isAuthenticated: boolean;
    failure: boolean;
}>;

export async function checkIfAuthenticated(): Promise<Authentication> {
    try {
        const requestHeaders = await headers();
        const token = getToken(requestHeaders);

        if (!token) {
            return { isAuthenticated: false, failure: false };
        }

        const valid = await isTokenValid(token);
        return { isAuthenticated: valid, failure: false };
    } catch {
        return { isAuthenticated: false, failure: true };
    }
}

type UserAgreement = Readonly<{
    userAgreementAccepted: boolean;
    failure: boolean;
}>;

export async function checkIfUserAgreementIsAccepted(): Promise<UserAgreement> {
    const aduserUserUrl = `${requiredEnv("PAMADUSER_URL")}/api/v1/user`;

    const baseHeaders = await getDefaultHeaders();
    const auth = await getAduserRequestHeaders({ csrf: "none", baseHeaders });

    if (!auth.ok) {
        return { userAgreementAccepted: false, failure: true };
    }

    const res = await fetch(aduserUserUrl, {
        method: "GET",
        headers: auth.headers,
        cache: "no-store",
    });

    if (res.ok) {
        return { userAgreementAccepted: true, failure: false };
    }

    // TODO: litt usikert på om 404 er riktig statuskode for "bruker har ikke akseptert???
    if (res.status === 404) {
        appLogger.info("User agreement not accepted");
        return { userAgreementAccepted: false, failure: false };
    }

    appLogger.httpError("GET user from aduser failed while checking agreement.", {
        method: "GET",
        url: res.url,
        status: res.status,
        statusText: res.statusText,
    });

    return { userAgreementAccepted: false, failure: true };
}
