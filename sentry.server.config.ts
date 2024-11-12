import * as Sentry from "@sentry/nextjs";
import { getCallId } from "@/app/_common/monitoring/callId";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    debug: false,

    beforeSend(event) {
        event.tags = { ...event.tags, navCallId: getCallId() };
        return event;
    },
});
