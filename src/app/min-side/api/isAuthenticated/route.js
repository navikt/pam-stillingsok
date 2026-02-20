import { headers } from "next/headers";
import { isTokenValid } from "@/app/min-side/_common/auth/auth.server.ts";
import { appLogger } from "@/app/_common/logging/appLogger.ts";

export async function GET() {
    const bearerToken = (await headers()).get("authorization");
    if (bearerToken) {
        try {
            const token = bearerToken.replace("Bearer ", "");
            const validToken = await isTokenValid(token);
            if (validToken) {
                return new Response("OK", {
                    status: 200,
                });
            } else {
                return new Response("Unauthorized", {
                    status: 401,
                });
            }
        } catch (e) {
            appLogger.errorWithCause(`Idporten-token kunne ikke valideres`, e);
            return new Response(e.message, {
                status: 500,
            });
        }
    } else {
        return new Response("No token found", {
            status: 401,
        });
    }
}
