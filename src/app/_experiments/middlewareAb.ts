import { NextRequest, NextResponse } from "next/server";
import { experimentsRuntime } from "@/app/_experiments/experiments";
import { evaluateExperimentRandom } from "@/app/_experiments/evaluateRandom";
import { getExperimentCookieName } from "@/app/_experiments/cookies";

export type AbMiddlewareOptions = Readonly<{
    readonly hasAnalyticsConsent: boolean;
    readonly isRsc: boolean;
    readonly isDocumentRequest: boolean;
    readonly pathname: string;
}>;

export function applyAbCookies(request: NextRequest, response: NextResponse, options: AbMiddlewareOptions): void {
    const isProd = process.env.NODE_ENV === "production";

    // Ikke sett noe uten samtykke
    if (!options.hasAnalyticsConsent) {
        return;
    }

    // Ikke på RSC/fetch
    if (options.isRsc) {
        return;
    }

    // Kun på document-like requests
    if (!options.isDocumentRequest) {
        return;
    }

    for (const def of experimentsRuntime) {
        // Skru av betyr: ikke sett cookie
        if (def.status !== "on") {
            continue;
        }

        const isInScope =
            !def.pathPrefixes ||
            def.pathPrefixes.some((prefix) => {
                return options.pathname.startsWith(prefix);
            });

        if (!isInScope) {
            continue;
        }

        const experimentCookieName = getExperimentCookieName(def.key);

        // Sticky: hvis cookie allerede finnes, ikke rør
        const alreadyAssigned = request.cookies.get(experimentCookieName)?.value;
        if (alreadyAssigned) {
            continue;
        }

        // random + set cookie for alle (standard/test)
        const evaluation = evaluateExperimentRandom(def);
        const cookieValue = evaluation.variant;

        /**
         * Cookie kan slettes på egen route: await fetch("/api/consent/ab", { method: "POST" });
         * Dette gjøres ved umami onConsentChanged gjør dette for å fjerne alle AB-cookies når samtykke endres,
         * slik at nye cookies settes på nytt ved neste request basert på oppdatert samtykke og random-evaluering.
         * Det er ryddig og fint
         */
        response.cookies.set(experimentCookieName, cookieValue, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProd,
            path: "/",
            maxAge: 60 * 60 * 24 * 120, // 120 dager
        });
    }
}
