import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(): Promise<NextResponse> {
    const cookieStore = await cookies();

    cookieStore.set({
        name: "organizationNumber",
        value: "",
        path: "/",
        maxAge: 0,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
}
