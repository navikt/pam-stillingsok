import { getSession } from "@navikt/oasis";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const session = await getSession(req);

    if (!session) {
        return new Response(null, { status: 401 });
    }

    return new Response(null, { status: 200 });
}
