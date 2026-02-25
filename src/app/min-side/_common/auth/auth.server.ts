import "server-only";
import { verifyIdPortenJwtDetailed } from "@/app/min-side/_common/auth/idportenVerifier";
import { Issuer, Client } from "openid-client";
import { extractBearer } from "@/app/min-side/_common/auth/extractBearer";
import { appLogger } from "@/app/_common/logging/appLogger";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";

export const runtime = "nodejs";
type Nullable<T> = T | null;
type JsonWebKey = {
    readonly kty: string;
    readonly kid?: string;
    readonly use?: string;
    readonly alg?: string;
    readonly [parameter: string]: unknown;
};

type JWKS = {
    readonly keys: JsonWebKey[];
};

let tokenXIssuer: Nullable<Issuer<Client>> = null;
let tokenXClient: Nullable<Client> = null;

export const CSRF_COOKIE_NAME = "XSRF-TOKEN-ARBEIDSPLASSEN";

async function getTokenXIssuer(): Promise<Issuer<Client>> {
    if (!tokenXIssuer) {
        tokenXIssuer = await Issuer.discover(requiredEnv("TOKEN_X_WELL_KNOWN_URL"));
    }
    return tokenXIssuer;
}

async function getClient(): Promise<Client> {
    if (tokenXClient) return tokenXClient;

    const issuer = await getTokenXIssuer();
    const clientId = requiredEnv("TOKEN_X_CLIENT_ID");
    const privateJwkRaw = requiredEnv("TOKEN_X_PRIVATE_JWK");
    const privateJwk = JSON.parse(privateJwkRaw);
    const jwks: JWKS = { keys: [privateJwk] };

    tokenXClient = new issuer.Client(
        {
            client_id: clientId,
            token_endpoint_auth_method: "private_key_jwt",
            token_endpoint_auth_signing_alg: "RS256",
        },
        jwks,
    );

    return tokenXClient;
}

export async function isTokenValid(token: string) {
    const res = await verifyIdPortenJwtDetailed(token);
    if (!res.ok) {
        const name = res.errorName ?? "JWTVerificationError";

        appLogger.error(`ID-porten JWT verifisering feilet: ${name}`, {
            ok: res.ok,
            message: res.message,
            name: res.errorName ?? "JWTVerificationError",
        });
    }
    return res.ok;
}

/** TokenX grant (token exchange). Returnerer tom streng ved feil. */
export const grant = async (accessToken: string, tokenAudience: string) => {
    if (!(await isTokenValid(accessToken))) {
        return "";
    }

    try {
        const client = await getClient();

        const additionalClaims = {
            clientAssertionPayload: {
                aud: client.issuer.metadata.token_endpoint,
                nbf: Math.floor(Date.now() / 1000),
            },
        } as const;

        const tokenSet = await client.grant(
            {
                grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
                client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
                audience: tokenAudience,
                subject_token: accessToken,
            },
            additionalClaims as Record<string, unknown>,
        );
        return tokenSet.access_token ?? "";
    } catch (e) {
        const oidcError = createOidcUnknownError(e);
        appLogger.errorWithCause("Kunne ikke veksle inn token", e, { oidcError: oidcError, component: "auth" });
        return "";
    }
};

type OpenIdClientErrorLike = {
    response?: { statusCode?: number; statusMessage?: string; body?: unknown };
};

/**
 * Lager en feilmelding for ukjent feil i OpenID Connect-token exchange.
 * Inneholder informasjon om statuskode, statusmelding og body fra TokenX.
 */
const createOidcUnknownError = (err: unknown): string => {
    const e = err as OpenIdClientErrorLike;
    const statusCode = e.response?.statusCode ?? "";
    const statusMessage = e.response?.statusMessage ?? "";
    const body = e.response?.body ? JSON.stringify(e.response.body) : "";
    return `Noe gikk galt med token exchange mot TokenX.
            Feilmelding fra openid-client: (${String(err)}).
            HTTP Status fra TokenX: (${statusCode} ${statusMessage})
            Body fra TokenX: ${body}`;
};

export type ExchangeTokenOk = Readonly<{ ok: true; token: string }>;
export type ExchangeTokenFail = Readonly<{ ok: false; response: Response }>;
export type ExchangeTokenResult = ExchangeTokenOk | ExchangeTokenFail;
export async function exchangeToken(request: Request): Promise<ExchangeTokenResult> {
    const audience = requiredEnv("ADUSER_AUDIENCE");
    const idportenToken = extractBearer(request.headers);

    if (!idportenToken) {
        return { ok: false, response: new Response("Ingen Authorization-header", { status: 401 }) };
    }

    const token = await grant(idportenToken, audience);

    if (!token) {
        return { ok: false, response: new Response("Det har skjedd en feil ved utveksling av token", { status: 401 }) };
    }

    return { ok: true, token };
}

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
