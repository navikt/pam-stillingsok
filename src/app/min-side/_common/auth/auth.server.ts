import "server-only";
import { verifyIdPortenJwtDetailed } from "@/app/min-side/_common/auth/idportenVerifier";
import { Issuer, Client } from "openid-client";
import type { JWK } from "jose";
import { v4 as uuidv4 } from "uuid";
import logger from "@/app/min-side/_common/utils/logger";
import { extractBearer } from "@/app/min-side/_common/auth/extractBearer";

export const runtime = "nodejs";
type Nullable<T> = T | null;

let tokenXIssuer: Nullable<Issuer<Client>> = null;
let tokenXClient: Nullable<Client> = null;

export const CSRF_COOKIE_NAME = "XSRF-TOKEN-ARBEIDSPLASSEN";

const requiredEnv = (name: string) => {
    const envElement = process.env[name];
    if (!envElement) {
        throw new Error(`Missing required env: ${name}`);
    }
    return envElement;
};

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
    const privateJwk = JSON.parse(privateJwkRaw) as JWK;
    const jwks = { keys: [privateJwk as unknown as Record<string, unknown>] };

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
        logger.error(`ID-porten JWT verifisering feilet: ${name}: ${res.message}`);
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
        logger.error(`Kunne ikke veksle inn token: ${createOidcUnknownError(e)}`);
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

export async function exchangeToken(request: Request) {
    const audience = requiredEnv("ADUSER_AUDIENCE");
    const idportenToken = extractBearer(request.headers);

    if (!idportenToken) {
        return new Response("Ingen Authorization-header", { status: 401 });
    }

    const token = await grant(idportenToken, audience);

    if (!token) {
        return new Response("Det har skjedd en feil ved utveksling av token", { status: 401 });
    }

    return token;
}

export function createAuthorizationAndContentTypeHeaders(token: string, csrf: string) {
    const requestHeaders = new Headers();

    requestHeaders.set("authorization", `Bearer ${token}`);
    requestHeaders.set("content-type", "application/json");
    requestHeaders.set("nav-callid", uuidv4());

    if (csrf) {
        requestHeaders.set("cookie", `${CSRF_COOKIE_NAME}=${csrf}`);
        requestHeaders.set(`X-${CSRF_COOKIE_NAME}`, csrf);
    }
    return requestHeaders;
}
