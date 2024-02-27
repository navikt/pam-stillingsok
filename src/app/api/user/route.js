import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "../../_common/auth/auth";

export const dynamic = "force-dynamic";

const ADUSER_USER_URL = `${process.env.PAMADUSER_URL}/api/v1/user`;

export async function GET() {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(ADUSER_USER_URL, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        console.error("Failed to fetch from aduser");
        console.error(res.status);
        return new Response(null, { status: res.status, headers: res.headers });
    }

    let data = await res.json();

    return Response.json(data, { headers: res.headers });
}

export async function POST(req) {
    const oboToken = await getAdUserOboToken();

    const res = await fetch(ADUSER_USER_URL, {
        method: "POST",
        body: req.body,
        credentials: "same-origin",
        duplex: "half",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        console.error("Failed to post to aduser");
        console.error(res.status);
        return new Response(null, { status: res.status });
    }

    let data = await res.json();

    return Response.json(data);
}

export async function PUT() {
    return new Response("", { status: 200 });
}
