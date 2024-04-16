import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";
import { cookies, headers } from "next/headers";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";

export const ADUSER_XSRF_COOKIE_NAME = "XSRF-TOKEN-ARBEIDSPLASSEN";
const ADUSER_XSRF_HEADER_NAME = "X-XSRF-TOKEN-ARBEIDSPLASSEN";

export function getDefaultAuthHeaders(oboToken) {
    const localHeaders = getDefaultHeaders();

    localHeaders.set("Authorization", `Bearer ${oboToken}`);

    return localHeaders;
}

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

export function getAdUserDefaultAuthHeadersWithCsrfToken(oboToken) {
    const csrfToken = cookies().get(ADUSER_XSRF_COOKIE_NAME)?.value;

    if (!csrfToken) {
        throw new Error("Failed to get CSRF token");
    }

    const localHeaders = getDefaultAuthHeaders(oboToken);

    localHeaders.set("cookie", `${ADUSER_XSRF_COOKIE_NAME}=${csrfToken}`);
    localHeaders.set(ADUSER_XSRF_HEADER_NAME, csrfToken);

    return localHeaders;
}
