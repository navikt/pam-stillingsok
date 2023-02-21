export const FIELD_SESSION_ID = 'sessionId';
export default function getSessionId() {
    let sessionId = null;
    try {
        sessionId = sessionStorage.getItem(FIELD_SESSION_ID);
        if (sessionId === null) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem(FIELD_SESSION_ID, sessionId);
        }
    } catch (e) {
        // It's possible user has disabled persistent data or user is unable to use crypto
        sessionId = 'undefined';
    }
    return sessionId;
}
