import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isInternalAuthorized } from "@/app/api/internal/_utils/internalAuth";
import { revalidateGeografiTag } from "@/app/_common/geografi/revalidateGeografi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JsonResponse =
    | { readonly ok: true; readonly revalidated: true; readonly tag: string; readonly now: number }
    | { readonly ok: false; readonly revalidated: false; readonly message: string };

export async function POST(request: NextRequest): Promise<NextResponse<JsonResponse>> {
    if (!isInternalAuthorized(request)) {
        return NextResponse.json({ ok: false, revalidated: false, message: "Unauthorized" }, { status: 401 });
    }

    revalidateGeografiTag();

    return NextResponse.json({ ok: true, revalidated: true, tag: "geografi", now: Date.now() });
}

export async function GET(): Promise<NextResponse<JsonResponse>> {
    return NextResponse.json({ ok: false, revalidated: false, message: "Method Not Allowed" }, { status: 405 });
}
