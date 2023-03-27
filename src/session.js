import { v4 as uuidv4 } from "uuid";

export const FIELD_SESSION_ID = "sessionId";
export default function getSessionId() {
    let sessionId = null;
    try {
        sessionId = sessionStorage.getItem(FIELD_SESSION_ID);
        if (sessionId === null) {
            sessionId = uuidv4();
            sessionStorage.setItem(FIELD_SESSION_ID, sessionId);
        }
    } catch (e) {
        // It's possible user has disabled persistent data
        sessionId = "undefined";
    }
    return sessionId;
}
