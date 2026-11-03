import { type NextRequest, NextResponse } from "next/server";
import { applyCookieChanges, planConsentCookieChanges } from "@/app/_experiments/next/experiments.server";

function isSameOrigin(req: NextRequest): boolean {
    const fetchSite = req.headers.get("sec-fetch-site");
    if (fetchSite !== null) {
        return fetchSite === "same-origin";
    }

    // Fallback for nettlesere uten Fetch Metadata. Uten Origin er det ikke en nettleser-skjema-POST.
    const origin = req.headers.get("origin");
    if (origin === null) {
        return true;
    }
    try {
        const originHost = new URL(origin).host;
        const hosts = [req.headers.get("host"), req.headers.get("x-forwarded-host")];
        return hosts.some((host) => host !== null && host === originHost);
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    // Samtykke-cookien er SameSite=Lax og følger ikke med cross-site POST. Uten denne sjekken ville en annen side kunne slette ID-en.
    if (!isSameOrigin(req)) {
        return NextResponse.json({ ok: false }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true });
    applyCookieChanges(res.cookies, planConsentCookieChanges(req.headers.get("cookie")));
    return res;
}
