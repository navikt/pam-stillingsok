import { bindGlobals, startTracking, track, trackPageview, trackerStateChanged } from "./track";
import type { EventName, EventPayload } from "./events";
import { getWebsiteId } from "@/app/_common/umami/getWebsiteId";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

// Kalles i app-oppsett app.tsx
export const configureAnalytics = (): void => {
    bindGlobals(
        () => CookieBannerUtils.getConsentValues(),
        () => getWebsiteId(),
    );

    // Sett endepunktet
    startTracking(
        "https://umami.nav.no/api/send",
        /* optional redact */ undefined,
        /* debug */ process.env.NODE_ENV !== "production",
    );
};

// Re-evalluer når bruker endrer samtykke i banneret:
export const onConsentChanged = (): void => {
    trackerStateChanged();
};

export { track, trackPageview };
export type { EventName, EventPayload };
