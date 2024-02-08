import initSentry from "./app/_common/tracking/sentry";
import { initAmplitude } from "./app/_common/tracking/amplitude";
import googleTranslateWorkaround from "./app/_common/utils/googleTranslateWorkaround";

// todo flytt til App.jsx
initSentry();
initAmplitude();
googleTranslateWorkaround();
