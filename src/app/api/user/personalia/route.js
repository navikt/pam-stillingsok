import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/_common/auth/auth";
import logger from "@/app/_common/utils/logger";

export const dynamic = "force-dynamic";

const ADUSER_PERSONALIA_URL = `${process.env.PAMADUSER_URL}/api/v1/personalia`;

export async function GET() {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch (e) {
        return new Response(null, { status: 401 });
    }

    const res = await fetch(ADUSER_PERSONALIA_URL, {
        method: "GET",
        headers: getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.error(`GET personalia from aduser failed. ${res.status} ${res.statusText}`);
        return new Response(null, { status: res.status, headers: res.headers });
    }

    let data = await res.json();

    return Response.json(data, { headers: res.headers });
}
