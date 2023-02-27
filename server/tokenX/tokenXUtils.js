const { Issuer } = require("openid-client");
const { createRemoteJWKSet, jwtVerify } =  require('jose');

let tokenXClient;

let clientId = process.env.TOKEN_X_CLIENT_ID;
let tokenXIssuer;
let remoteJWKSet;
let tokenXAud = process.env.TOKEN_X_AUDIENCE;

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
            audience: clientId,
            issuer: tokenXIssuer.metadata.issuer,
        });

        return !!verification.payload;
    } catch (e) {
        console.error("Det skjedde en feil under validering av token");
        return false;
    }
}

async function getTokenX(token) {
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
                audience: tokenXAud,
                subject_token: token
            },
            additionalClaims
        );
    } catch (e) {
        console.error("Kunne ikke veksle inn til tokenX");
    }
    return tokenX;

}

async function initIssuerAndClient() {
    tokenXIssuer = await Issuer.discover(process.env.TOKEN_X_WELL_KNOWN_URL)
    tokenXClient = new tokenXIssuer.Client(
        {
            client_id: process.env.TOKEN_X_CLIENT_ID,
            token_endpoint_auth_method: 'private_key_jwt',
        },
        {
            keys: [JSON.parse(process.env.TOKEN_X_PRIVATE_JWK)],
        }
    );
}

const opprettRemoteJWKSet = () => {
    const jwksUrl = new URL(process.env.TOKEN_X_JWKS_URI);
    remoteJWKSet = createRemoteJWKSet(jwksUrl);
};

module.exports = { initializeTokenX, getTokenX, tokenIsValid }