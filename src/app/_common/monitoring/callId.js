import { headers } from "next/headers";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export const NAV_CALL_ID_TAG = "Nav-CallId";

export function getCallId() {
    return headers().get(NAV_CALL_ID_TAG);
}

export function addCallIdHeader(requestHeaders) {
    const existingCallId = headers().get(NAV_CALL_ID_TAG);

    if (!uuidValidate(existingCallId)) {
        requestHeaders.set(NAV_CALL_ID_TAG, uuidv4());
    }
}
