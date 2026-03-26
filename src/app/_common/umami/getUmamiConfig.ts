"use client";

type UmamiConfig = Readonly<{
    websiteId: string;
    scriptSrc: string;
}>;

const DEV_DOMAIN = "arbeidsplassen.intern.dev.nav.no";
const PROD_DOMAIN = "arbeidsplassen.nav.no";

const DEV_WEBSITE_ID = "1cc70e4f-bb41-4d28-8115-cbbc32bee4d3";
const PROD_WEBSITE_ID = "c2f0a46d-a5b4-4370-8b80-b9b9fcd39f96";

const DEV_SCRIPT_SRC = "https://cdn.nav.no/team-researchops/sporing/sporing-dev.js";
const PROD_SCRIPT_SRC = "https://cdn.nav.no/team-researchops/sporing/sporing.js";

export function getUmamiConfig(): UmamiConfig | null {
    if (typeof window === "undefined") {
        return null;
    }

    const hostname = window.location.hostname;

    if (hostname === DEV_DOMAIN) {
        return {
            websiteId: DEV_WEBSITE_ID,
            scriptSrc: DEV_SCRIPT_SRC,
        };
    }

    if (hostname === PROD_DOMAIN) {
        return {
            websiteId: PROD_WEBSITE_ID,
            scriptSrc: PROD_SCRIPT_SRC,
        };
    }

    return null;
}
