import { v4 as uuidv4 } from "uuid";

export const SESSION_ID_TAG = "sessionId";
export const SESSION_ID_TIMESTAMP_TAG = "sessionIdTimestamp";
const SESSION_MAX_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function getSessionId() {
    let sessionId: string | null = null;
    let sessionIdTimestamp: string | null = null;
    try {
        sessionId = sessionStorage.getItem(SESSION_ID_TAG);
        sessionIdTimestamp = sessionStorage.getItem(SESSION_ID_TIMESTAMP_TAG);

        const now = Date.now();
        if (!sessionId || !sessionIdTimestamp || now - parseInt(sessionIdTimestamp, 10) > SESSION_MAX_DURATION_MS) {
            sessionId = uuidv4();
            sessionIdTimestamp = now.toString();
            sessionStorage.setItem(SESSION_ID_TAG, sessionId);
            sessionStorage.setItem(SESSION_ID_TIMESTAMP_TAG, sessionIdTimestamp);
        }
    } catch (e) {
        // It's possible user has disabled persistent data
        sessionId = "undefined";
    }
    return sessionId;
}
