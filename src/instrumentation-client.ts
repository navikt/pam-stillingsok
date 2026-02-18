import { configureLogger } from "@navikt/next-logger";

/** The instrumentation-client.ts file allows you to add monitoring,
 * analytics code, and other side-effects that run before your application becomes interactive
 * https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */
configureLogger({
    basePath: process.env.NEXT_PUBLIC_CONTEXT_PATH ?? undefined,
});
