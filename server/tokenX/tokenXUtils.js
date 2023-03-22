const { Issuer } = require("openid-client");
const { createRemoteJWKSet, jwtVerify } =  require('jose');

let tokenXClient;

let tokenXIssuer;
let idPortenIssuer;
let remoteJWKSet;

async function initializeTokenX() {
    try {
        await initIssuerAndClient();
        opprettRemoteJWKSet();
    } catch (e) {
        throw Error('Klarte ikke å initialisere TokenX:' + e);
    }
}

async function tokenIsValid(token) {
    try {
        const verification = await jwtVerify(token, remoteJWKSet, {
            audience: process.env.IDPORTEN_AUDIENCE,
            issuer: idPortenIssuer.metadata.issuer,
        });

        return !!verification.payload;
    } catch (e) {
        console.error(`Det skjedde en feil under validering av token, ${e.message}`);
        return false;
    }
}

async function getTokenX(token, audience) {
    let tokenX;
    const additionalClaims = {
        clientAssertionPayload: {
            aud: tokenXClient.issuer.metadata.token_endpoint,
            nbf: Math.floor(Date.now() / 1000),
        }
    }

    try {
        tokenX = await tokenXClient.grant(
            {
                grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
                client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
                audience: audience,
                subject_token: token
            },
            additionalClaims
        );
    } catch (e) {
        console.error(`Kunne ikke veksle inn til tokenX: ${e.message}`);
    }
    return tokenX;

}

async function initIssuerAndClient() {
    tokenXIssuer = await Issuer.discover(process.env.TOKEN_X_WELL_KNOWN_URL);
    idPortenIssuer = await Issuer.discover(process.env.IDPORTEN_WELL_KNOWN_URL);
    tokenXClient = new tokenXIssuer.Client(
        {
            client_id: process.env.TOKEN_X_CLIENT_ID,
            token_endpoint_auth_method: 'private_key_jwt',
            token_endpoint_auth_signing_alg: "RS256"
        },
        {
            keys: [JSON.parse(process.env.TOKEN_X_PRIVATE_JWK)],
        }
    );
}

const opprettRemoteJWKSet = () => {
    const jwksUrl = new URL(process.env.IDPORTEN_JWKS_URI);
    remoteJWKSet = createRemoteJWKSet(jwksUrl);
};

module.exports = { initializeTokenX, getTokenX, tokenIsValid }