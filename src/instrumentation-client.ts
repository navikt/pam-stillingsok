import { initNaisAPMClient } from "@nais/apm/react";
import { configureLogger } from "@navikt/next-logger";
import { stripFreeTextFromPageUrl } from "@/app/_common/monitoring/apm/stripFreeTextFromPageUrl";

initNaisAPMClient({
    app: "pam-stillingsok",
    namespace: "teampam",
    tracing: true,
    beforeSend: stripFreeTextFromPageUrl,
});

/** The instrumentation-client.ts file allows you to add monitoring,
 * analytics code, and other side-effects that run before your application becomes interactive
 * https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */
configureLogger({
    basePath: process.env.NEXT_PUBLIC_CONTEXT_PATH ?? undefined,
});
