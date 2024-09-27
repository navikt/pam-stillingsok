import { v4 as uuidv4 } from "uuid";

export const NAV_CALL_ID_TAG = "Nav-CallId";

export function getCallId() {
    return uuidv4();
}
