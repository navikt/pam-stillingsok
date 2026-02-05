import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

export async function getDirApiOboToken() {
    const headerValue = await headers();
    const token = getToken(headerValue);

    if (!token) {
        throw new Error("Could not get token");
    }

    const validationResult = await validateToken(token);

    if (!validationResult.ok) {
        throw new Error("Failed to validate token");
    }

    const oboResult = await requestTokenxOboToken(token, process.env.PAM_DIR_API_AUDIENCE || "");

    if (!oboResult.ok) {
        throw new Error("Failed to get exchange token");
    }

    return oboResult.token;
}

export async function getDirApiOboHeaders() {
    const token = await getDirApiOboToken();
    const headers = await getDefaultHeaders();
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
}
