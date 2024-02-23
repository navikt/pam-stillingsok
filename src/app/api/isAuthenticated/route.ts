import { validateToken, getToken } from "@navikt/oasis";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const validationResult = await validateToken(getToken(req));

    if (!validationResult.ok) {
        return new Response(null, { status: 401 });
    }

    return new Response(null, { status: 200 });
}
