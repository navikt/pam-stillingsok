import type { EventName, TrackArgsFor } from "@/app/_common/umami/events";

export function trackingEvent<Name extends EventName>(...args: TrackArgsFor<Name>): TrackArgsFor<Name> {
    return args;
}
