import "server-only";
import { appLogger } from "@/app/_common/logging/appLogger";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";

export const CSRF_COOKIE_NAME = "XSRF-TOKEN-ARBEIDSPLASSEN";

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

function unauthorized(message: string): ExchangeTokenFail {
    return { ok: false, response: new Response(message, { status: 401 }) };
}

function badGateway(message: string): ExchangeTokenFail {
    return { ok: false, response: new Response(message, { status: 502 }) };
}

function looksUnauthorized(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
        message.includes("unauthorized") ||
        message.includes("invalid") ||
        message.includes("expired") ||
        message.includes("jwt") ||
        message.includes("token")
    );
}

export async function exchangeTokenOasis(request: Request): Promise<ExchangeTokenResult> {
    const audience = requiredEnv("ADUSER_AUDIENCE");

    const token = getToken(request.headers);

    if (!token) {
        return unauthorized("Ingen Authorization-header");
    }

    const obo = await requestTokenxOboToken(token, audience);

    if (!obo.ok) {
        if (looksUnauthorized(obo.error)) {
            // forventet: expired/invalid
            appLogger.debug("Token exchange avvist (ugyldig/utløpt token)", { err: obo.error });
            return unauthorized("Ugyldig eller utløpt token");
        }
        appLogger.errorWithCause("Token exchange feilet (TokenX/upstream)", obo.error);
        return badGateway("Token exchange feilet");
    }
    return { ok: true, token: obo.token };
}
