import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GEOGRAFI_CACHE_TAG, revalidateGeografiTag } from "@/app/_common/geografi/revalidateGeografi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JsonResponse =
    | { readonly ok: true; readonly revalidated: true; readonly tag: string; readonly now: number }
    | { readonly ok: false; readonly revalidated: false; readonly message: string };

const INTERNAL_TOKEN_HEADER = "x-internal-token" as const;

const isAuthorized = (request: NextRequest): boolean => {
    const expectedToken = process.env.INTERNAL_REVALIDATE_TOKEN;

    if (!expectedToken || expectedToken.trim().length === 0) {
        // Fail closed i prod: ikke la endpoint være åpen hvis token ikke er satt.
        return false;
    }

    const providedToken = request.headers.get(INTERNAL_TOKEN_HEADER);

    if (!providedToken) {
        return false;
    }

    return providedToken === expectedToken;
};

export async function POST(request: NextRequest): Promise<NextResponse<JsonResponse>> {
    if (!isAuthorized(request)) {
        return NextResponse.json({ ok: false, revalidated: false, message: "Unauthorized" }, { status: 401 });
    }

    revalidateGeografiTag();

    return NextResponse.json({
        ok: true,
        revalidated: true,
        tag: GEOGRAFI_CACHE_TAG,
        now: Date.now(),
    });
}

export async function GET(): Promise<NextResponse<JsonResponse>> {
    return NextResponse.json({ ok: false, revalidated: false, message: "Method Not Allowed" }, { status: 405 });
}
