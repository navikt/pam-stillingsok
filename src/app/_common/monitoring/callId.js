import { headers } from "next/headers";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export const NAV_CALL_ID_TAG = "Nav-CallId";

export function getCallId() {
    let callId = headers().get(NAV_CALL_ID_TAG);

    if (!uuidValidate(callId)) {
        callId = uuidv4();
    }
    
    return callId;
}
