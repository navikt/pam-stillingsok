import type { NextRequest, NextResponse } from "next/server";
import { getExperimentCookieName } from "@/app/_experiments/cookies";
import { evaluateExperimentRandom } from "@/app/_experiments/evaluateRandom";
import { experimentsRuntime } from "@/app/_experiments/experiments";

export type AbMiddlewareOptions = Readonly<{
    readonly hasAnalyticsConsent: boolean;
    readonly isRsc: boolean;
    readonly isDocumentRequest: boolean;
    readonly pathname: string;
}>;

function isEligibleForAb(options: AbMiddlewareOptions): boolean {
    return options.hasAnalyticsConsent && !options.isRsc && options.isDocumentRequest;
}

/**
 * Evaluerer hvilke AB-varianter som skal tildeles nye besøkende (uten eksisterende cookie).
 * Må kalles FØR NextResponse.next() slik at resultatet kan injiseres i request-headers
 * og dermed leses av server-komponenter via cookies() i samme request.
 */
export function buildAbAssignments(request: NextRequest, options: AbMiddlewareOptions): Map<string, string> {
    const assignments = new Map<string, string>();
    if (!isEligibleForAb(options)) {
        return assignments;
    }

    for (const def of experimentsRuntime) {
        if (def.status !== "on") {
            continue;
        }

        const isInScope = !def.pathPrefixes || def.pathPrefixes.some((prefix) => options.pathname.startsWith(prefix));
        if (!isInScope) {
            continue;
        }

        const cookieName = getExperimentCookieName(def.key);
        if (request.cookies.get(cookieName)?.value) {
            continue; // sticky: allerede tildelt
        }

        const evaluation = evaluateExperimentRandom(def);
        assignments.set(cookieName, evaluation.variant);
    }

    return assignments;
}

/**
 * Injiserer nye AB-tildelinger i cookie-headeren på requestHeaders slik at server-komponenter
 * kan lese riktig variant via cookies() allerede på første request — ikke bare fra andre besøk.
 * Kall denne FØR NextResponse.next({ request: { headers: requestHeaders } }).
 */
export function injectAbRequestHeaders(requestHeaders: Headers, assignments: Map<string, string>): void {
    if (assignments.size === 0) {
        return;
    }

    const existing = requestHeaders.get("cookie") ?? "";
    const newParts = [...assignments.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
    requestHeaders.set("cookie", existing ? `${existing}; ${newParts}` : newParts);
}

/**
 * Setter AB-variant-cookies i HTTP-responsen slik at nettleseren lagrer dem til neste request.
 * Cookie kan slettes via /api/consent/ab ved samtykkeendring.
 */
export function applyAbResponseCookies(response: NextResponse, assignments: Map<string, string>): void {
    if (assignments.size === 0) {
        return;
    }

    const isProd = process.env.NODE_ENV === "production";
    for (const [name, value] of assignments) {
        response.cookies.set(name, value, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProd,
            path: "/",
            maxAge: 60 * 60 * 24 * 120, // 120 dager
        });
    }
}
