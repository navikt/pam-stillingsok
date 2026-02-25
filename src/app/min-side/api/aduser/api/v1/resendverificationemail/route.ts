import { appLogger } from "@/app/_common/logging/appLogger";
import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeTokenOasis,
} from "@/app/min-side/_common/auth/auth.server";
import { NextRequest } from "next/server";
import { requiredEnv } from "@/app/_common/utils/requiredEnv";
import { NodeDuplexRequestInit } from "@/app/stillinger/_common/types/NodeDuplexRequestInit";

// Låser denne route-handleren til Node runtime for å unngå at Next (nå eller senere) forsøker å kjøre den på Edge.
// Viktig pga. TokenX/OBO og streaming av request.body (duplex).
export const runtime = "nodejs";
export async function PUT(request: NextRequest) {
    appLogger.debug("PUT resendverificationemail");

    const exchanged = await exchangeTokenOasis(request);
    if (!exchanged.ok) {
        return exchanged.response;
    }

    const headers = createAuthorizationAndContentTypeHeaders(
        exchanged.token,
        request.cookies.get(CSRF_COOKIE_NAME)?.value,
    );

    try {
        const init: NodeDuplexRequestInit = {
            method: "PUT",
            headers,
            credentials: "same-origin",
            duplex: "half",
        };
        const userUrl = `${requiredEnv("PAMADUSER_URL").replace(/\/+$/, "")}/api/v1/user`;
        const res = await fetch(userUrl + "/resend-verification-mail", init);

        const contentType = res.headers.get("content-type") ?? "application/json";
        appLogger.info("PUT resendverificationemail upstream response", { status: res.status });
        if (!res.ok) {
            const upstreamText = await res.text();

            appLogger.httpError("PUT resendverificationemail feilet status", {
                method: "PUT",
                url: res.url,
                status: res.status,
                statusText: upstreamText,
            });

            return new Response(upstreamText || "En feil skjedde", {
                status: res.status,
                headers: { "content-type": contentType },
            });
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        appLogger.errorWithCause("PUT resendverificationemail fetch feilet", error);
        return new Response("Fetch feilet", { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } });
    }
}
