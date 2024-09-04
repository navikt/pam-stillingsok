import { register } from "prom-client";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
    return new Response(await register.metrics(), {
        headers: { "Content-Type": register.contentType },
    });
}
