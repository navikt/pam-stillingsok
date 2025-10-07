"use server";

import { getCallIdFromHeaders } from "@/app/stillinger/_common/monitoring/getRequestCallId";
import { NAV_CALL_ID_TAG } from "@/app/stillinger/_common/monitoring/constants";

export async function getDefaultHeaders(): Promise<Headers> {
    const headers = new Headers();
    const callId = await getCallIdFromHeaders(headers);
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    if (callId) {
        headers.set(NAV_CALL_ID_TAG, callId);
    }

    return headers;
}
