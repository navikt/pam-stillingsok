"use server";

import { getToken, validateToken, ValidationResult } from "@navikt/oasis";
import { headers } from "next/headers";
import { getAdUserOboToken, getDefaultAuthHeaders } from "@/app/stillinger/_common/auth/auth";
import { appLogger } from "@/app/_common/logging/appLogger";

interface Authentication {
    isAuthenticated: boolean;
    failure: boolean;
}

function mapValidationToAuth(validation: ValidationResult): Authentication {
    if (validation.ok) {
        return { isAuthenticated: true, failure: false };
    }

    // Token finnes, men er ugyldig/utløpt → ikke "failure", bare "not authenticated"
    if (validation.errorType === "token expired") {
        return { isAuthenticated: false, failure: false };
    }

    // unknown kan være: token malformed, signaturfeil, osv. Vanligvis også "not authenticated".
    // Skal vi skille mellom "ikke innlogget" og "systemfeil" kan vi sette failure=true,
    return { isAuthenticated: false, failure: false };
}

export async function checkIfAuthenticated(): Promise<Authentication> {
    try {
        const requestHeaders = await headers();
        const token = getToken(requestHeaders);

        if (!token) {
            return { isAuthenticated: false, failure: false };
        }

        const validation = await validateToken(token);
        return mapValidationToAuth(validation);
    } catch {
        return { isAuthenticated: false, failure: true };
    }
}

interface UserAgreement {
    userAgreementAccepted: boolean;
    failure: boolean;
}

export async function checkIfUserAgreementIsAccepted(): Promise<UserAgreement> {
    let oboToken: string;
    try {
        oboToken = await getAdUserOboToken();
    } catch {
        return { userAgreementAccepted: false, failure: true };
    }

    try {
        const res = await fetch(`${process.env.PAMADUSER_URL}/api/v1/user`, {
            method: "GET",
            headers: await getDefaultAuthHeaders(oboToken),
            cache: "no-store",
        });

        if (res.status === 200) {
            return { userAgreementAccepted: true, failure: false };
        }

        if (res.status === 404) {
            return { userAgreementAccepted: false, failure: false };
        }

        if (res.status === 401 || res.status === 403) {
            return { userAgreementAccepted: false, failure: true };
        }

        if (res.status >= 500) {
            return { userAgreementAccepted: false, failure: true };
        }

        return { userAgreementAccepted: false, failure: false };
    } catch (error) {
        appLogger.errorWithCause("Feil ved sjekk av samtykke", error);
        return { userAgreementAccepted: false, failure: true };
    }
}
