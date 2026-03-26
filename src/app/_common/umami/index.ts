import type { EventName, EventPayload } from "./events";
import { track, trackPageview } from "./track";

export const onConsentChanged = async (): Promise<void> => {
    try {
        await fetch("/api/consent/ab", { method: "POST" });
    } finally {
        location.reload();
    }
};

export { track, trackPageview };
export type { EventName, EventPayload };
