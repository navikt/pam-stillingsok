import { NextRequest } from "next/server";
import { extractBearer } from "@/app/min-side/_common/auth/extractBearer";
import { isTokenValid } from "@/app/min-side/_common/auth/auth.server";
import { appLogger } from "@/app/_common/logging/appLogger";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
    const token = extractBearer(request.headers);

    if (!token) {
        return new Response("No token found", { status: 401 });
    }

    try {
        const validToken = await isTokenValid(token);
        if (validToken) {
            return new Response("OK", { status: 200 });
        }

        return new Response("Unauthorized", { status: 401 });
    } catch (error) {
        appLogger.errorWithCause("Idporten-token kunne ikke valideres", error);

        const message = error instanceof Error ? error.message : "Ukjent feil";
        return new Response(message, { status: 500 });
    }
}
