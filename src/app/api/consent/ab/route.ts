import { type NextRequest, NextResponse } from "next/server";

const retiredCookieNames = ["ab_qualifications_soek_superrask_cta"];

function clearCookie(res: NextResponse, name: string): void {
    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set(name, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 0,
    });
}

export async function POST(_req: NextRequest) {
    const res = NextResponse.json({ ok: true });

    for (const name of retiredCookieNames) {
        clearCookie(res, name);
    }

    return res;
}
