"use server";

import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { appLogger } from "@/app/_common/logging/appLogger";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";

export async function getSuperraskSoknadTokenIfLoggedIn(): Promise<string | null> {
    const audience = requiredEnv("INTEREST_API_AUDIENCE");

    try {
        const requestHeaders = await headers();
        const idportenToken = getToken(requestHeaders);

        if (!idportenToken) {
            return null;
        }

        const validation = await validateToken(idportenToken);
        if (!validation.ok) {
            appLogger.debug("Superrask søknad: ID-porten token validation failed", {
                errorType: validation.errorType,
            });
            return null;
        }

        const obo = await requestTokenxOboToken(idportenToken, audience);
        if (!obo.ok) {
            appLogger.debug("Superrask søknad: TokenX exchange failed", { err: obo.error });
            return null;
        }

        return obo.token;
    } catch (error) {
        appLogger.debug("Superrask søknad: Unexpected error getting OBO token", { err: error });
        return null;
    }
}
