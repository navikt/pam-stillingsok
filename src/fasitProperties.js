export const CONTEXT_PATH = window.__PAM_CONTEXT_PATH__ || '/stillinger';
export const AD_USER_API = window.__PAM_AD_USER_API__ || 'http://localhost:9017/aduser';
export const STILLINGSOK_URL = window.__PAM_STILLINGSOK_URL__ || 'http://localhost:8080/stillinger';
export const LOGIN_URL = window.__LOGIN_URL__ ? `${window.__LOGIN_URL__}?level=Level3&redirect=` : 'http://localhost:9017/aduser/local/cookie?subject=12345';
export const LOGOUT_URL = window.__LOGOUT_URL__ ||'http://localhost:9017/aduser/';
