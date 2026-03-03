import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { exchangeTokenOasis } from "@/app/_common/auth/auth.server";

export const dynamic = "force-dynamic";

type AuthStatusResponse = Readonly<{ ok: true; isAuthenticated: true } | { ok: true; isAuthenticated: false }>;

export async function GET(request: NextRequest): Promise<NextResponse<AuthStatusResponse>> {
    const exchange = await exchangeTokenOasis(request);

    if (!exchange.ok) {
        if (exchange.response.status === 401) {
            return NextResponse.json({ ok: true, isAuthenticated: false }, { status: 200 });
        }

        return NextResponse.json({ ok: true, isAuthenticated: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true, isAuthenticated: true }, { status: 200 });
}
