import "server-only";
import { cache } from "react";
import { createAuthorizationAndContentTypeHeaders } from "@/app/_common/auth/auth.server";
import { appLogger } from "@/app/_common/logging/appLogger";
import { getDirApiOboToken } from "@/app/muligheter/_common/auth/auth";

/**
 * Server-side access check for muligheter.
 * Returns true if the user has access to direktemeldte stillinger.
 * Returns false on any failure (auth, network, access denied).
 *
 * Memoized per request with React cache() to avoid duplicate OBO + dir-api
 * calls when used in both generateMetadata and Page.
 */
export const checkMuligheterAccess = cache(async (): Promise<boolean> => {
    let oboToken;
    try {
        oboToken = await getDirApiOboToken();
    } catch (err) {
        appLogger.warnWithCause("Muligheter access check - OBO for dir-api feilet:", err);
        return false;
    }

    let res;
    try {
        res = await fetch(`${process.env.PAM_DIR_API_URL}/rest/dir/tilgang`, {
            method: "GET",
            headers: createAuthorizationAndContentTypeHeaders(oboToken),
        });
    } catch (err) {
        appLogger.warnWithCause("Muligheter access check - Network error:", err);
        return false;
    }

    if (!res.ok) {
        appLogger.info(`Muligheter access check - Tilgang feilet. Status: ${res.status}`);
        return false;
    }

    try {
        const json = await res.json();
        return json.harTilgangTilDirektemeldteStillinger === true;
    } catch (err) {
        appLogger.warnWithCause("Muligheter access check - JSON parse feilet:", err);
        return false;
    }
});
