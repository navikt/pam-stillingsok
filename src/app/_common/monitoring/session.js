import { v4 as uuidv4 } from 'uuid';

export const SESSION_ID_TAG = 'sessionId';
export function getSessionId() {
  let sessionId = null;
  try {
    sessionId = sessionStorage.getItem(SESSION_ID_TAG);
    if (sessionId === null) {
      sessionId = uuidv4();
      sessionStorage.setItem(SESSION_ID_TAG, sessionId);
    }
  } catch (e) {
    // It's possible user has disabled persistent data
    sessionId = 'undefined';
  }
  return sessionId;
}
