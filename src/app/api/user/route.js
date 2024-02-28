import {
    getAdUserDefaultAuthHeadersWithCsrfToken,
    getAdUserOboToken,
    getDefaultAuthHeaders,
} from "../../_common/auth/auth";
import logger from "@/app/_common/utils/logger";

export const dynamic = "force-dynamic";

const ADUSER_USER_URL = `${process.env.PAMADUSER_URL}/api/v1/user`;

export async function GET() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return new Response(null, { status: 401 });
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.error(`GET user from aduser failed. ${res.status} ${res.statusText}`);
        return new Response(null, { status: res.status, headers: res.headers });
    }

    let data = await res.json();

    return Response.json(data, { headers: res.headers });
}

export async function POST(req) {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return new Response(null, { status: 401 });
    }

    const res = await fetch(ADUSER_USER_URL, {
        method: "POST",
        body: req.body,
        credentials: "same-origin",
        duplex: "half",
        headers: getAdUserDefaultAuthHeadersWithCsrfToken(oboToken),
    });

    if (!res.ok) {
        logger.error(`POST user to aduser failed. ${res.status} ${res.statusText}`);
        return new Response(null, { status: res.status });
    }

    let data = await res.json();

    return Response.json(data);
}

export async function PUT() {
    return new Response("", { status: 200 });
}
