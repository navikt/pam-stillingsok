import { bindGlobals, startTracking, track, trackPageview, trackerStateChanged } from "./track";
import type { EventName, EventPayload } from "./events";
import { getWebsiteId } from "@/app/_common/umami/getWebsiteId";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

/**
 * Konfigurerer Umami analytics med nødvendige globale funksjoner og starter sporing.
 * Må kalles tidlig i applikasjonens livssyklus (App.tsx).
 */
export const configureAnalytics = (): void => {
    bindGlobals(
        () => CookieBannerUtils.getConsentValues(),
        () => getWebsiteId(),
    );

    // Start tracking med Umami endepunkt
    startTracking(
        "https://umami.nav.no/api/send",
        /* optional redact */ undefined, // kan brukes til å fjerne sensitiv info fra payload
        /* debug */ process.env.NODE_ENV !== "production",
    );
};

/**
 * Kalles når samtykke endres (f.eks. bruker aksepterer/revokerer cookies).
 * Dette vil trigge en re-evaluering av trackeren for å starte/stoppe sporing basert på nytt samtykke.
 */
export const onConsentChanged = (): void => {
    trackerStateChanged();
};

export { track, trackPageview };
export type { EventName, EventPayload };
