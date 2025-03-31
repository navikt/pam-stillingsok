import * as Sentry from "@sentry/nextjs";
import { getCallId } from "@/app/stillinger/_common/monitoring/callId";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    debug: false,

    beforeSend: async (event) => {
        event.tags = { ...event.tags, navCallId: await getCallId() };
        return event;
    },
});
