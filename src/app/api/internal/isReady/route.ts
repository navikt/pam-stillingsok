export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
    return new Response("OK", {
        status: 200,
    });
}
