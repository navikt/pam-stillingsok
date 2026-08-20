import { getConsentValues } from "@navikt/arbeidsplassen-react";

const COOKIE_NAME = "ab_searchbox_simple_variant_rated";
const MAX_AGE_DAYS = 120;

export function getSearchExperienceRatingCookieName(): string {
    return COOKIE_NAME;
}

export function hasSearchExperienceRatingCookie(): boolean {
    if (typeof document === "undefined") {
        return false;
    }

    return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

export function setSearchExperienceRatingCookie(value: "rated" | "dismissed"): void {
    if (typeof document === "undefined") {
        return;
    }

    if (!getConsentValues().analyticsConsent) {
        return;
    }

    const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
    // biome-ignore lint/suspicious/noDocumentCookie: Enkel client-side cookie for AB-test — Cookie Store API har ikke tilstrekkelig nettleserstøtte
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}
