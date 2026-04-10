import "server-only";
import { NextResponse } from "next/server";
import { getDirApiOboToken } from "@/app/muligheter/_common/auth/auth";
import { appLogger } from "@/app/_common/logging/appLogger";
import { HasMuligheterAccess } from "@/app/muligheter/_common/auth/apiClient";
import { createAuthorizationAndContentTypeHeaders } from "@/app/_common/auth/auth.server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<HasMuligheterAccess>> {
    if (process.env.MULIGHETER_ENABLED !== "true") {
        return NextResponse.json({ hasMuligheterAccess: false, failure: false }, { status: 200 });
    }

    try {
        let oboToken;
        try {
            oboToken = await getDirApiOboToken();
        } catch (err) {
            appLogger.warnWithCause("Muligheter error - OBO for dir-api feilet:", err);
            return NextResponse.json({ hasMuligheterAccess: false, failure: true });
        }

        const res = await fetch(`${process.env.PAM_DIR_API_URL}/rest/dir/tilgang`, {
            method: "GET",
            headers: createAuthorizationAndContentTypeHeaders(oboToken),
        });

        if (!res.ok) {
            if (res.status === 401) {
                const json = await res.json();
                appLogger.warn(
                    `Muligheter error - Bruker har ikke tilgang til direktemeldte stillinger. ${json.harTilgangTilDirektemeldteStillinger}`,
                );
            } else {
                appLogger.info(
                    `Muligheter error - Tilgang til direktemeldte stillinger sjekk feilet. Status: ${res.status}`,
                );
            }

            return NextResponse.json({ hasMuligheterAccess: false, failure: true });
        }

        return await res
            .json()
            .then((response) => {
                return NextResponse.json({
                    hasMuligheterAccess: response.harTilgangTilDirektemeldteStillinger,
                    failure: false,
                });
            })
            .catch((err) => {
                appLogger.warnWithCause("Muligheter error - Tilgangskall mot dir-api feilet:", err);
                return NextResponse.json({ hasMuligheterAccess: false, failure: true });
            });
    } catch (err) {
        appLogger.warnWithCause("Muligheter error - Tilgangskall mot dir-api feilet:", err);
        return NextResponse.json({ hasMuligheterAccess: false, failure: true });
    }
}
