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
        // It's possible user has disabled persistent data and we won't be able to track sessions
        // Use prefix 'undefined' to separate these instances out from the rest.
        sessionId = `undefined-${crypto.randomUUID()}`
    }
    return sessionId;
}
