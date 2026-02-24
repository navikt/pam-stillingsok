import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";
import { cookies, headers } from "next/headers";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { appLogger } from "@/app/_common/logging/appLogger";

export const ADUSER_XSRF_COOKIE_NAME = "XSRF-TOKEN-ARBEIDSPLASSEN";
const ADUSER_XSRF_HEADER_NAME = "X-XSRF-TOKEN-ARBEIDSPLASSEN";

export async function getAdUserOboToken() {
    const headerValue = await headers();
    const token = getToken(headerValue);

    if (!token) {
        throw new Error("Could not get token");
    }

    const validationResult = await validateToken(token);

    if (!validationResult.ok) {
        throw new Error("Failed to validate token");
    }

    appLogger.info("Successfully validated token, requesting OBO token for ADUSER");
    const oboResult = await requestTokenxOboToken(token, process.env.ADUSER_AUDIENCE || "");

    if (!oboResult.ok) {
        throw new Error("Failed to get exchange token");
    }

    return oboResult.token;
}

export async function getDefaultAuthHeaders(oboToken: string) {
    const headers = await getDefaultHeaders();

    headers.set("Authorization", `Bearer ${oboToken}`);

    return headers;
}

export async function getAdUserDefaultAuthHeadersWithCsrfToken(oboToken: string) {
    const requestCookies = await cookies();

    const csrfToken = requestCookies.get(ADUSER_XSRF_COOKIE_NAME)?.value;

    if (!csrfToken) {
        throw new Error("Failed to get CSRF token");
    }

    const headers = await getDefaultAuthHeaders(oboToken);

    headers.set("cookie", `${ADUSER_XSRF_COOKIE_NAME}=${csrfToken}`);
    headers.set(ADUSER_XSRF_HEADER_NAME, csrfToken);

    return headers;
}
