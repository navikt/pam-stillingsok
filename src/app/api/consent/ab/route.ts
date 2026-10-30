import { type NextRequest, NextResponse } from "next/server";
import { applyCookieChanges, planConsentCookieChanges } from "@/app/_experiments/next/experiments.server";

export async function POST(req: NextRequest) {
    // Samtykke-cookien er SameSite=Lax og følger ikke med cross-site POST. Uten denne sjekken ville en annen side kunne slette ID-en.
    const fetchSite = req.headers.get("sec-fetch-site");
    if (fetchSite !== null && fetchSite !== "same-origin") {
        return NextResponse.json({ ok: false }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true });
    applyCookieChanges(res.cookies, planConsentCookieChanges(req.headers.get("cookie")));
    return res;
}
