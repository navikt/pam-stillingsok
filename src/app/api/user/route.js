import { validateToken, requestTokenxOboToken, getToken } from "@navikt/oasis";

export const dynamic = "force-dynamic";

export async function GET(req) {
    const token = getToken(req);
    const validationResult = await validateToken(token);

    if (!validationResult.ok) {
        return new Response(null, { status: 401 });
    }

    const oboRes = await requestTokenxOboToken(token, process.env.ADUSER_AUDIENCE);
    if (!oboRes.ok) {
        console.error("Failed to exchange token");
        console.error(oboRes.error);
        return new Response(null, { status: 500 });
    }

    const url = `${process.env.PAMADUSER_URL}/api/v1/user`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${oboRes.token}`,
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch from aduser");
        console.error(res.status);
        return new Response(null, { status: res.status });
    }

    let data = await res.json();

    return Response.json(data);
}

export async function POST(req) {
    const token = getToken(req);
    const validationResult = await validateToken(token);

    if (!validationResult.ok) {
        return new Response(null, { status: 401 });
    }

    const oboRes = await requestTokenxOboToken(token, process.env.ADUSER_AUDIENCE);
    if (!oboRes.ok) {
        console.error("Failed to exchange token");
        console.error(oboRes.error);
        return new Response(null, { status: 500 });
    }

    const url = `${process.env.PAMADUSER_URL}/api/v1/user`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(req.body),
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${oboRes.token}`,
        },
    });

    if (!res.ok) {
        console.error("Failed to fetch from aduser");
        console.error(res.status);
        return new Response(null, { status: res.status });
    }

    let data = await res.json();

    return Response.json(data);
}

export async function PUT() {
    return new Response("", { status: 200 });
}
