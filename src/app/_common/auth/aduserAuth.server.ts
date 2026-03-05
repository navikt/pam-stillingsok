import "server-only";

import { cookies, headers } from "next/headers";
import { getToken, requestTokenxOboToken, validateToken } from "@navikt/oasis";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { appLogger } from "@/app/_common/logging/appLogger";

export const ADUSER_XSRF_COOKIE_NAME = "XSRF-TOKEN-ARBEIDSPLASSEN" as const;
export const ADUSER_XSRF_HEADER_NAME = "X-XSRF-TOKEN-ARBEIDSPLASSEN" as const;

type CsrfMode = "none" | "required";

export type AduserAuthFailureReason =
    | "MISSING_AUTH"
    | "TOKEN_INVALID"
    | "OBO_UNAUTHORIZED"
    | "OBO_UPSTREAM"
    | "CSRF_MISSING"
    | "CONFIG_MISSING"
    | "UNEXPECTED";

export type AduserAuthHeadersOk = Readonly<{ ok: true; headers: Headers }>;
export type AduserAuthHeadersFail = Readonly<{
    ok: false;
    status: 400 | 401 | 500 | 502;
    reason: AduserAuthFailureReason;
    message: string;
    cause?: unknown;
}>;
export type AduserAuthHeadersResult = AduserAuthHeadersOk | AduserAuthHeadersFail;

export type GetAduserRequestHeadersOptions = Readonly<{
    csrf: CsrfMode;
    /**
     * Hvis du allerede har "default headers" (f.eks. fra getDefaultHeaders()),
     */
    baseHeaders?: Headers;
    contentType?: "application/json" | "none";
}>;

/**
 * Er litt usikker på om denne gir en match på alle relevante feilmeldinger fra obo.error
 * Har spurt ioasis-maintainers kanelen de skulle grave litt. men vurderer
 * en litt mer distinkt string literal union som sier nøyaktig hva som har feilet
 * https://nav-it.slack.com/archives/C06GZFG0ELC/p1772019328731339?thread_ts=1772017216.432139&cid=C06GZFG0ELC
 * @param error
 */
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

async function getOboToken(): Promise<
    | Readonly<{ ok: true; token: string }>
    | Readonly<{
          ok: false;
          status: 401 | 500 | 502;
          reason: AduserAuthFailureReason;
          message: string;
          cause?: unknown;
      }>
> {
    let audience: string;
    try {
        audience = requiredEnv("ADUSER_AUDIENCE");
    } catch (error) {
        return { ok: false, status: 500, reason: "CONFIG_MISSING", message: "Mangler ADUSER_AUDIENCE", cause: error };
    }

    const headerSource = await headers();
    const bearer = getToken(headerSource);

    if (!bearer) {
        return { ok: false, status: 401, reason: "MISSING_AUTH", message: "Ingen Authorization-header" };
    }

    const validation = await validateToken(bearer);
    if (!validation.ok) {
        return {
            ok: false,
            status: 401,
            reason: "TOKEN_INVALID",
            message: "Ugyldig eller utløpt token",
            cause: validation.error,
        };
    }

    const obo = await requestTokenxOboToken(bearer, audience);
    if (!obo.ok) {
        if (looksUnauthorized(obo.error)) {
            appLogger.debug("Token exchange avvist (ugyldig/utløpt token)", { err: obo.error });
            return {
                ok: false,
                status: 401,
                reason: "OBO_UNAUTHORIZED",
                message: "Token exchange avvist",
                cause: obo.error,
            };
        }

        appLogger.errorWithCause("Token exchange feilet (TokenX/upstream)", obo.error);
        return { ok: false, status: 502, reason: "OBO_UPSTREAM", message: "Token exchange feilet", cause: obo.error };
    }

    return { ok: true, token: obo.token };
}

export type OboTokenOk = Readonly<{ ok: true; token: string }>;
export type OboTokenFail = Readonly<{ ok: false; status: 401 | 500 | 502; message: string }>;
export type OboTokenResult = OboTokenOk | OboTokenFail;
export async function getAduserOboTokenFromHeaders(headerSource: Headers): Promise<OboTokenResult> {
    const audience = requiredEnv("ADUSER_AUDIENCE");

    const token = getToken(headerSource);
    if (!token) {
        return { ok: false, status: 401, message: "Ingen Authorization-header" };
    }

    const validation = await validateToken(token);
    if (!validation.ok) {
        return { ok: false, status: 401, message: "Ugyldig eller utløpt token" };
    }

    const obo = await requestTokenxOboToken(token, audience);
    if (!obo.ok) {
        if (looksUnauthorized(obo.error)) {
            appLogger.debug("Token exchange avvist (ugyldig/utløpt token)", { err: obo.error });
            return { ok: false, status: 401, message: "Token exchange avvist" };
        }

        appLogger.errorWithCause("Token exchange feilet (TokenX/upstream)", obo.error);
        return { ok: false, status: 502, message: "Token exchange feilet" };
    }

    return { ok: true, token: obo.token };
}

async function ensureCsrfCookieExists(oboToken: string): Promise<boolean> {
    const cookieStore = await cookies();
    const existing = cookieStore.get(ADUSER_XSRF_COOKIE_NAME)?.value ?? "";

    if (existing) {
        return true;
    }

    const bootstrapHeaders = new Headers();
    bootstrapHeaders.set("authorization", `Bearer ${oboToken}`);
    bootstrapHeaders.set("content-type", "application/json");

    const after = (await cookies()).get(ADUSER_XSRF_COOKIE_NAME)?.value ?? "";
    return Boolean(after);
}

/**
 * - bygger OBO
 * - setter Authorization + Content-Type
 * - hvis csrf=required: sørger for CSRF-cookie
 *
 * Returnerer en union i stedet for å throw -> slipper 500/"⨯" på forventede auth-feil.
 */
export async function getAduserRequestHeaders(
    options: GetAduserRequestHeadersOptions,
): Promise<AduserAuthHeadersResult> {
    try {
        const oboResult = await getOboToken();
        if (!oboResult.ok) {
            return {
                ok: false,
                status: oboResult.status,
                reason: oboResult.reason,
                message: oboResult.message,
                cause: oboResult.cause,
            };
        }

        const requestHeaders = options.baseHeaders ? new Headers(options.baseHeaders) : new Headers();
        requestHeaders.set("authorization", `Bearer ${oboResult.token}`);

        const contentType = options.contentType ?? "application/json";
        if (contentType !== "none") {
            requestHeaders.set("content-type", contentType);
        }

        if (options.csrf === "none") {
            return { ok: true, headers: requestHeaders };
        }

        const cookieStore = await cookies();
        let csrfToken = cookieStore.get(ADUSER_XSRF_COOKIE_NAME)?.value ?? "";

        if (!csrfToken) {
            const bootstrapped = await ensureCsrfCookieExists(oboResult.token);
            if (!bootstrapped) {
                return { ok: false, status: 401, reason: "CSRF_MISSING", message: "Mangler CSRF-token" };
            }

            csrfToken = (await cookies()).get(ADUSER_XSRF_COOKIE_NAME)?.value ?? "";
        }

        if (!csrfToken) {
            return { ok: false, status: 401, reason: "CSRF_MISSING", message: "Mangler CSRF-token" };
        }

        requestHeaders.set("cookie", `${ADUSER_XSRF_COOKIE_NAME}=${csrfToken}`);
        requestHeaders.set(ADUSER_XSRF_HEADER_NAME, csrfToken);

        return { ok: true, headers: requestHeaders };
    } catch (error) {
        appLogger.errorWithCause("Ukjent feil ved bygging av aduser request headers", error);
        return { ok: false, status: 500, reason: "UNEXPECTED", message: "Ukjent auth-feil", cause: error };
    }
}
