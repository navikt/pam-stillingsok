import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { exchangeTokenOasis } from "@/app/_common/auth/auth.server";

export const dynamic = "force-dynamic";

export type AuthStatusOk = Readonly<{ ok: true; isAuthenticated: boolean }>;
export type AuthStatusFail = Readonly<{ ok: false; error: "upstream" | "unknown" }>;
export type AuthStatusResponse = AuthStatusOk | AuthStatusFail;

export async function GET(request: NextRequest): Promise<NextResponse<AuthStatusResponse>> {
    const exchange = await exchangeTokenOasis(request);

    if (!exchange.ok) {
        if (exchange.response.status === 401) {
            return NextResponse.json({ ok: true, isAuthenticated: false }, { status: 200 });
        }

        return NextResponse.json({ ok: false, error: "upstream" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, isAuthenticated: true }, { status: 200 });
}
