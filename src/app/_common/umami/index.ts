import type { EventName, EventPayload } from "./events";
import { track, trackConsentAction, persistPendingEvents } from "./track";

export const onConsentChanged = async (): Promise<void> => {
    try {
        await fetch("/api/consent/ab", { method: "POST" });
    } finally {
        // Lagre køede events til sessionStorage slik at de overlever reload.
        // Samtykke er allerede gitt på dette tidspunktet (consent-cookie satt av CookieBannerB).
        persistPendingEvents();
        location.reload();
    }
};

export { track, trackConsentAction };
export type { EventName, EventPayload };
