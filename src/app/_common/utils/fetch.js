import { NAV_CALL_ID_TAG, getCallId } from '@/app/_common/monitoring/callId';

export function getDefaultHeaders() {
  const headers = new Headers();

  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set(NAV_CALL_ID_TAG, getCallId());

  return headers;
}
