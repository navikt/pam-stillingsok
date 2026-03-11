import { NextRequest, NextResponse } from "next/server";
import { experiments } from "@/app/_experiments/experiments";
import { evaluateExperiment } from "@/app/_experiments/evaluate";
import { AB_USER_ID_COOKIE, getExperimentCookieName, serializeExperimentCookieValue } from "@/app/_experiments/cookies";

export type AbMiddlewareOptions = Readonly<{
    readonly hasAnalyticsConsent: boolean;
    readonly isRsc: boolean;
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

    // Scope: bare dokument-lignende requests (HTML/navigate) for å redusere spam
    const accept = request.headers.get("accept") ?? "";
    const secFetchMode = request.headers.get("sec-fetch-mode");
    const secFetchDest = request.headers.get("sec-fetch-dest");
    const isDocumentLike = secFetchMode === "navigate" || secFetchDest === "document" || accept.includes("text/html");

    if (!isDocumentLike) {
        return;
    }

    const existingUserId = request.cookies.get(AB_USER_ID_COOKIE)?.value;
    const userId = existingUserId ?? crypto.randomUUID();

    if (!existingUserId) {
        response.cookies.set(AB_USER_ID_COOKIE, userId, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProd,
            path: "/",
            maxAge: 60 * 60 * 24 * 90, // 90 dager
        });
    }

    for (const def of experiments) {
        const isInScope =
            !def.pathPrefixes ||
            def.pathPrefixes.some((prefix) => {
                return options.pathname.startsWith(prefix);
            });

        if (!isInScope) {
            continue;
        }

        const experimentCookieName = getExperimentCookieName(def.key);

        // Sticky: ikke overstyr eksisterende assignment
        const alreadyAssigned = request.cookies.get(experimentCookieName)?.value;
        if (alreadyAssigned) {
            continue;
        }

        const evaluation = evaluateExperiment(def, userId);
        const cookieValue = serializeExperimentCookieValue({ variant: evaluation.variant });

        response.cookies.set(experimentCookieName, cookieValue, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProd,
            path: "/",
            maxAge: 60 * 60 * 24 * 90, // 90 dager
        });
    }
}
