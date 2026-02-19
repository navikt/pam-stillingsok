export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { exchangeToken } from "@/app/min-side/_common/auth/auth.server.ts";
import { logger } from "@navikt/next-logger";

export async function GET(request) {
    logger.info("GET personalia");

    const token = await exchangeToken(request);

    if (token === "") {
        return new Response("Det har skjedd en feil ved utveksling av token", {
            status: 401,
        });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("authorization", `Bearer ${token}`);
    requestHeaders.set("content-type", "application/json");

    let aduserUrl = `${process.env.PAMADUSER_URL}/api/v1/personalia`;

    const res = await fetch(aduserUrl, {
        credentials: "same-origin",
        method: "GET",
        headers: requestHeaders,
    });

    if (res.ok) {
        const data = await res.json();
        return Response.json(data, {
            headers: res.headers,
        });
    }

    return new Response(res.body, {
        status: res.status,
    });
}
