import { getAdUserOboToken } from "../../_common/auth/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
    const oboToken = await getAdUserOboToken();

    const url = `${process.env.PAMADUSER_URL}/api/v1/user`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oboToken}`,
        },
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

    const url = `${process.env.PAMADUSER_URL}/api/v1/user`;
    const res = await fetch(url, {
        method: "POST",
        body: req.body,
        credentials: "same-origin",
        duplex: "half",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${oboToken}`,
            cookie: `XSRF-TOKEN-ARBEIDSPLASSEN=${req.cookies?.get("XSRF-TOKEN-ARBEIDSPLASSEN")?.value}`,
            "X-XSRF-TOKEN-ARBEIDSPLASSEN": req.cookies?.get("XSRF-TOKEN-ARBEIDSPLASSEN")?.value,
        },
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
