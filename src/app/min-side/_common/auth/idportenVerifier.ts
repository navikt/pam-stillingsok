import { createRemoteJWKSet, JWTPayload, jwtVerify } from "jose";

type OpenIdConfiguration = { issuer: string; jwks_uri: string };

const AUDIENCE: string | undefined = process.env.IDPORTEN_AUDIENCE ?? undefined;
const ISSUER = (process.env.IDPORTEN_ISSUER ?? "").replace(/\/+$/, "");
const WELL_KNOWN = process.env.IDPORTEN_WELL_KNOWN ?? (ISSUER ? `${ISSUER}/.well-known/openid-configuration` : "");

let cachedIssuer: string | null = null;
let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

async function getIssuerAndJWKS() {
    if (cachedIssuer && cachedJWKS) return { issuer: cachedIssuer, jwks: cachedJWKS };
    if (!WELL_KNOWN) throw new Error("Mangler IDPORTEN_ISSUER eller IDPORTEN_WELL_KNOWN i miljøvariabler.");
    const res = await fetch(WELL_KNOWN, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Kunne ikke hente OpenID-konfig (${res.status})`);
    const cfg = (await res.json()) as OpenIdConfiguration;
    cachedIssuer = cfg.issuer.replace(/\/+$/, "");
    cachedJWKS = createRemoteJWKSet(new URL(cfg.jwks_uri));
    return { issuer: cachedIssuer, jwks: cachedJWKS };
}

type IdPortenClaims = JWTPayload & {
    sub?: string;
    acr?: string;
    amr?: string[];
};

type VerifyOutcome = { ok: true; claims: IdPortenClaims } | { ok: false; message: string; errorName?: string };

/** ÉN kjerne: verifiser og returner claims/feilinfo */
async function verifyIdPortenJwtCore(token: string): Promise<VerifyOutcome> {
    if (!token) return { ok: false, message: "Empty token" };
    try {
        const { issuer, jwks } = await getIssuerAndJWKS();
        const { payload } = await jwtVerify(token, jwks, { issuer, audience: AUDIENCE });
        return { ok: true, claims: payload as IdPortenClaims };
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const errorName = e instanceof Error ? e.name : undefined;
        return { ok: false, message, errorName };
    }
}

/** (tidl. verifyIdPortenJwtDetailed) – ok + feilmelding */
type VerifyResult = { ok: true } | { ok: false; message: string; errorName?: string };

export async function verifyIdPortenJwtDetailed(token: string): Promise<VerifyResult> {
    const r = await verifyIdPortenJwtCore(token);
    return r.ok ? { ok: true } : { ok: false, message: r.message, errorName: r.errorName };
}

/** (tidl. verifyIdPortenJwtWithClaims) – ok + claims */
type VerifyWithClaimsResult = { ok: true; claims: IdPortenClaims } | { ok: false; message: string; errorName?: string };

export async function verifyIdPortenJwtWithClaims(token: string): Promise<VerifyWithClaimsResult> {
    return verifyIdPortenJwtCore(token); // samme returtype-alias
}
