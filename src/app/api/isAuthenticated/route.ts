import { getSession } from "@navikt/oasis";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    console.log("HEJ!");
    const session = await getSession(req);

    if (!session) {
        console.error("Not logged in!");
        return new Response(null, { status: 401 });
    }

    console.error("Logged in!");
    return new Response(null, { status: 200 });
}
