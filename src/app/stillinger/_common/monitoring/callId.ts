"use server";

import { headers } from "next/headers";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { NAV_CALL_ID_TAG } from "./constants";

export async function getCallIdFromHeaders(headers: Headers): Promise<string> {
    let callId = headers.get(NAV_CALL_ID_TAG);

    if (callId == null || !uuidValidate(callId)) {
        callId = uuidv4();
    }

    return callId;
}

export async function getCallId(): Promise<string> {
    return getCallIdFromHeaders(headers());
}
