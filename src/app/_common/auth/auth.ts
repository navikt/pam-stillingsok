import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";

export async function getAdUserOboToken(): Promise<String> {
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
