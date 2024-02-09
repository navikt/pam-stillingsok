function getPublicEnv() {
    // Load public env vars here
    return {
        ADUSER_AUDIENCE: process.env.ADUSER_AUDIENCE,
        AMPLITUDE_TOKEN: process.env.AMPLITUDE_TOKEN,
        ARBEIDSPLASSEN_URL: process.env.ARBEIDSPLASSEN_URL,
        INTEREST_API_URL: process.env.INTEREST_API_URL,
        PAM_STILLINGSOK_URL: process.env.PAM_STILLINGSOK_URL,
    };
}

export async function GET() {
    const headers = new Headers({
        "Content-Type": "application/javascript",
    });

    return new Response(`publicEnv = ${JSON.stringify(getPublicEnv())}`, { status: 200, statusText: "", headers });
}
