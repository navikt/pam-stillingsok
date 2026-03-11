import { NextResponse, type NextRequest } from "next/server";
import { experiments } from "@/app/_experiments/experiments";
import { AB_USER_ID_COOKIE, getExperimentCookieName } from "@/app/_experiments/cookies";

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

    clearCookie(res, AB_USER_ID_COOKIE);
    for (const def of experiments) {
        clearCookie(res, getExperimentCookieName(def.key));
    }

    return res;
}
