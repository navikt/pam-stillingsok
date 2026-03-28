import type { EventName, EventPayload } from "./events";
import { track } from "./track";

export const onConsentChanged = async (): Promise<void> => {
    try {
        await fetch("/api/consent/ab", { method: "POST" });
    } finally {
        location.reload();
    }
};

export { track };
export type { EventName, EventPayload };
