"use client";

const DEV_DOMAIN = "arbeidsplassen.intern.dev.nav.no";
const EXT_DEV_DOMAIN = "arbeidsplassen.ekstern.dev.nav.no";
const PROD_DOMAIN = "arbeidsplassen.nav.no";
const DEV_WEBSITE_ID = "1cc70e4f-bb41-4d28-8115-cbbc32bee4d3";
const PROD_WEBSITE_ID = "c2f0a46d-a5b4-4370-8b80-b9b9fcd39f96";

export function getWebsiteId() {
    if (typeof window === "undefined") {
        return null;
    }
    if (window?.location?.hostname === DEV_DOMAIN || window?.location?.hostname === EXT_DEV_DOMAIN) {
        return DEV_WEBSITE_ID;
    }

    if (window?.location?.hostname === PROD_DOMAIN) {
        return PROD_WEBSITE_ID;
    }

    return null;
}
