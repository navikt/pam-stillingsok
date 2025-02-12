import { v4 as uuidv4 } from "uuid";

export const SESSION_TAG = "session";
export const SESSION_ID_TAG = "sessionId";
const SESSION_MAX_DURATION_MS = 60 * 1000; // 24 hours in milliseconds

export function getSessionId() {
    let session: { id: string; timestamp: number } | null = null;
    try {
        const sessionString: string | null = sessionStorage.getItem(SESSION_TAG);
        if (sessionString) {
            session = JSON.parse(sessionString);
        }

        const now = Date.now();
        if (!session || now - session.timestamp > SESSION_MAX_DURATION_MS) {
            session = {
                id: uuidv4(),
                timestamp: now,
            };
            sessionStorage.setItem(SESSION_TAG, JSON.stringify(session));
        }
    } catch (e) {
        // It's possible user has disabled persistent data
        session = { id: "undefined", timestamp: 0 };
    }
    return session.id;
}
