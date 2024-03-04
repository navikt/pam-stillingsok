import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";
import { cookies, headers } from "next/headers";
import { getDefaultHeaders } from '@/app/_common/utils/fetch';

export async function getAdUserOboToken() {
    const token = getToken(headers());

    if (!token) {
        throw new Error("Could not get token");
    }

    const validationResult = await validateToken(token);

    if (!validationResult.ok) {
        throw new Error("Failed to validate token");
    }

    const oboResult = await requestTokenxOboToken(token, process.env.ADUSER_AUDIENCE);

    if (!oboResult.ok) {
        throw new Error("Failed to get exchange token");
    }

    return oboResult.token;
}

const ADUSER_XSRF_COOKIE_NAME = "XSRF-TOKEN-ARBEIDSPLASSEN";
const ADUSER_XSRF_HEADER_NAME = "X-XSRF-TOKEN-ARBEIDSPLASSEN";

export function getAdUserDefaultAuthHeadersWithCsrfToken(oboToken) {
    const csrfToken = cookies().get(ADUSER_XSRF_COOKIE_NAME)?.value;

    if (!csrfToken) {
        throw new Error("Failed to get CSRF token");
    }

    const headers = getDefaultAuthHeaders(oboToken);

    headers.set("cookie", `${ADUSER_XSRF_COOKIE_NAME}=${csrfToken}`);
    headers.set(ADUSER_XSRF_HEADER_NAME, csrfToken);

    return headers;
}

export function getDefaultAuthHeaders(oboToken) {
    const headers = getDefaultHeaders();

    headers.set("Authorization", `Bearer ${oboToken}`);

    return headers;
}
