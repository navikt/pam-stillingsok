"use client";
/**
 * Svakhet med denne typen er at duplikater som ["uuid", "uuid"] er tillatt
 */
type OptOutFilter = "uuid"; // legg til andre når det blir støtte for det eks: | "orgnr"
type OptOutFilters = readonly [OptOutFilter, ...OptOutFilter[]];

type UmamiConfig = Readonly<{
    websiteId: string;
    scriptSrc: string;
    hostUrl: string;
    optOutFilters: OptOutFilters;
}>;

const DEV_INTERN_DOMAIN = "arbeidsplassen.intern.dev.nav.no";
const DEV_ANSATT_DOMAIN = "arbeidsplassen.ansatt.dev.nav.no";
const PROD_DOMAIN = "arbeidsplassen.nav.no";

const DEV_CONFIG: UmamiConfig = {
    websiteId: "1cc70e4f-bb41-4d28-8115-cbbc32bee4d3",
    scriptSrc: "https://cdn.nav.no/team-researchops/sporing/sporing-dev.js",
    hostUrl: "https://reops-event-proxy.ekstern.dev.nav.no",
    optOutFilters: ["uuid"],
};

const PROD_CONFIG: UmamiConfig = {
    websiteId: "c2f0a46d-a5b4-4370-8b80-b9b9fcd39f96",
    scriptSrc: "https://cdn.nav.no/team-researchops/sporing/sporing.js",
    hostUrl: "https://reops-event-proxy.nav.no",
    optOutFilters: ["uuid"],
};

export function getUmamiConfig(): UmamiConfig | null {
    if (typeof window === "undefined") {
        return null;
    }

    const hostname = window.location.hostname;

    if (hostname === DEV_INTERN_DOMAIN || hostname === DEV_ANSATT_DOMAIN) {
        return DEV_CONFIG;
    }

    if (hostname === PROD_DOMAIN) {
        return PROD_CONFIG;
    }

    return null;
}
