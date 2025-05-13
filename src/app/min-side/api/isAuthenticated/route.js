import logger from "@/app/min-side/_common/utils/logger";
import { headers } from "next/headers";
import { isTokenValid } from "@/app/min-side/_common/utils/tokenUtils";

export async function GET() {
    const bearerToken = headers().get("authorization");
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
            logger.error(`Idporten-token kunne ikke valideres: ${e.message}`);
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
