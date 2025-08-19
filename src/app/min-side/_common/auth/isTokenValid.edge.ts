import { createRemoteJWKSet, jwtVerify } from "jose";

type OpenIdConfiguration = {
    issuer: string;
    jwks_uri: string;
};

const AUDIENCE: string | undefined = process.env.IDPORTEN_AUDIENCE ?? undefined;
const ISSUER = (process.env.IDPORTEN_ISSUER ?? "").replace(/\/+$/, "");
const WELL_KNOWN = process.env.IDPORTEN_WELL_KNOWN ?? (ISSUER ? `${ISSUER}/.well-known/openid-configuration` : "");

let cachedIssuer: string | null = null;
let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

async function getIssuerAndJwks(): Promise<{
    issuer: string;
    jwks: ReturnType<typeof createRemoteJWKSet>;
}> {
    if (cachedIssuer && cachedJWKS) return { issuer: cachedIssuer, jwks: cachedJWKS };

    if (!WELL_KNOWN) {
        throw new Error("Mangler IDPORTEN_ISSUER eller IDPORTEN_WELL_KNOWN i miljøvariabler.");
    }

    // Edge-vennlig fetch; tillat cache av well-known i region
    const res = await fetch(WELL_KNOWN, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Kunne ikke hente OpenID-konfig (${res.status})`);

    const cfg = (await res.json()) as OpenIdConfiguration;
    const issuer = cfg.issuer.replace(/\/+$/, "");

    const jwks = createRemoteJWKSet(new URL(cfg.jwks_uri));

    cachedIssuer = issuer;
    cachedJWKS = jwks;

    return { issuer, jwks };
}

export async function isTokenValidEdge(token: string): Promise<boolean> {
    if (!token) return false;
    try {
        const { issuer, jwks } = await getIssuerAndJwks();
        await jwtVerify(token, jwks, {
            issuer,
            audience: AUDIENCE, // valideres kun hvis satt
        });
        console.debug("isTokenValidEdge", true);
        return true;
    } catch {
        return false;
    }
}
