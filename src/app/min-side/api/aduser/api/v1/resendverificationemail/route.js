export const runtime = "nodejs";
import { userUrl } from "@/app/min-side/api/aduser/api/v1/user/route";
import {
    createAuthorizationAndContentTypeHeaders,
    CSRF_COOKIE_NAME,
    exchangeToken,
} from "@/app/min-side/_common/auth/auth.server.ts";
import logger from "@/app/min-side/_common/utils/logger";

export async function PUT(request) {
    logger.info("PUT resendverificationemail");

    const token = await exchangeToken(request);
    const res = await fetch(userUrl + "/resend-verification-mail", {
        method: "PUT",
        headers: createAuthorizationAndContentTypeHeaders(token, request.cookies.get(CSRF_COOKIE_NAME)?.value),
        credentials: "same-origin",
        duplex: "half",
    });

    logger.info("/PUT response ", res.status);
    if (!res.ok) {
        return new Response(res.body, {
            status: res.status,
        });
    }

    return Response.json("{}");
}
