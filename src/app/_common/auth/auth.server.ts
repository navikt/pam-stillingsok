import "server-only";
import { appLogger } from "@/app/_common/logging/appLogger";
import { validateToken } from "@navikt/oasis";
import { getAduserOboTokenFromHeaders } from "@/app/_common/auth/aduserAuth.server";
import { ADUSER_XSRF_COOKIE_NAME } from "@/app/_common/auth/aduserAuth.server";

export const CSRF_COOKIE_NAME = ADUSER_XSRF_COOKIE_NAME;

export async function isTokenValid(token: string) {
    const validationResult = await validateToken(token);
    if (!validationResult.ok) {
        if (validationResult.errorType === "unknown") {
            appLogger.debug(`Validering av token feilet: ${validationResult.errorType}`, {
                err: validationResult.error,
            });
        }
    }
    return validationResult.ok;
}

export type ExchangeTokenOk = Readonly<{ ok: true; token: string }>;
export type ExchangeTokenFail = Readonly<{ ok: false; response: Response }>;
export type ExchangeTokenResult = ExchangeTokenOk | ExchangeTokenFail;

export function createAuthorizationAndContentTypeHeaders(token: string, csrf?: string | null) {
    const requestHeaders = new Headers();

    requestHeaders.set("authorization", `Bearer ${token}`);
    requestHeaders.set("content-type", "application/json");

    const csrfValue = csrf ?? "";
    if (csrfValue) {
        requestHeaders.set("cookie", `${CSRF_COOKIE_NAME}=${csrfValue}`);
        requestHeaders.set(`X-${CSRF_COOKIE_NAME}`, csrfValue);
    }
    return requestHeaders;
}

export async function exchangeTokenOasis(request: Request): Promise<ExchangeTokenResult> {
    const obo = await getAduserOboTokenFromHeaders(request.headers);

    if (!obo.ok) {
        return { ok: false as const, response: new Response(obo.message, { status: obo.status }) };
    }

    return { ok: true as const, token: obo.token };
}
