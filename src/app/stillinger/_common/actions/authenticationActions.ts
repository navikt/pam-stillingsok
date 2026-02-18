"use server";

import { getToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";
import logger from "@/app/stillinger/_common/utils/logger";
import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/stillinger/_common/auth/auth";
import { getDirApiOboToken } from "@/app/muligheter/_common/auth/auth";

interface Authentication {
    isAuthenticated: boolean;
    failure: boolean;
}

interface HasMuligheterAccess {
    hasMuligheterAccess: boolean;
    failure: boolean;
}

export async function checkIfAuthenticated(): Promise<Authentication> {
    try {
        const requestheaders = await headers();
        return await validateToken(getToken(requestheaders) as string)
            .then((validation) => ({ isAuthenticated: validation.ok, failure: false }))
            .catch(() => ({ isAuthenticated: false, failure: true }));
    } catch {
        return { isAuthenticated: false, failure: true };
    }
}

export async function checkIfHasMuligheterAccess(): Promise<HasMuligheterAccess> {
    if (process.env.MULIGHETER_ENABLED !== "true") {
        return { hasMuligheterAccess: false, failure: false };
    }

    try {
        let oboToken;
        try {
            oboToken = await getDirApiOboToken();
        } catch (err) {
            logger.warn(`Muligheter error - OBO for dir-api feilet: '${err}'`);
            return { hasMuligheterAccess: false, failure: true };
        }

        const res = await fetch(`${process.env.PAM_DIR_API_URL}/rest/dir/tilgang`, {
            method: "GET",
            headers: await getDefaultAuthHeaders(oboToken),
        });

        if (!res.ok) {
            if (res.status === 401) {
                const json = await res.json();
                logger.info("Tilgang til direktemeldte stillinger sjekk feilet", { json });
            }

            return { hasMuligheterAccess: false, failure: true };
        }

        return await res
            .json()
            .then((response) => {
                return {
                    hasMuligheterAccess: response.harTilgangTilDirektemeldteStillinger,
                    failure: false,
                };
            })
            .catch((err) => {
                logger.warn(`Muligheter error - Tilgangskall mot dir-api feilet: '${err}'`);
                return { hasMuligheterAccess: false, failure: true };
            });
    } catch (err) {
        logger.warn(`Muligheter error - Tilgangskall mot dir-api feilet: '${err}'`);
        return { hasMuligheterAccess: false, failure: true };
    }
}

interface UserAgreement {
    userAgreementAccepted: boolean;
    failure: boolean;
}

export async function checkIfUserAgreementIsAccepted(): Promise<UserAgreement> {
    let oboToken;
    try {
        oboToken = await getAdUserOboToken();
    } catch {
        return { userAgreementAccepted: false, failure: true };
    }

    const res = await fetch(`${process.env.PAMADUSER_URL}/api/v1/user`, {
        method: "GET",
        headers: await getDefaultAuthHeaders(oboToken),
    });

    if (!res.ok) {
        logger.info("User agreement not accepted");
        return { userAgreementAccepted: false, failure: false };
    }

    return { userAgreementAccepted: true, failure: false };
}
