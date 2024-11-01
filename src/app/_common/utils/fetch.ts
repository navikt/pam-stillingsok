import { getCallId, NAV_CALL_ID_TAG } from "@/app/_common/monitoring/callId";

export function getDefaultHeaders() {
    const headers = new Headers();
    const callId = getCallId();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    if (callId) {
        headers.set(NAV_CALL_ID_TAG, callId);
    }

    return headers;
}
