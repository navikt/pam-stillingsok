import * as Sentry from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";
import { Instrumentation } from "next";
import { IncomingHttpHeaders } from "node:http";
type HeaderDict = IncomingHttpHeaders;

export function register(): void {
    registerOTel({ serviceName: "pam-stillingsok" });

    if (process.env.NEXT_RUNTIME === "nodejs") {
        require("pino");

        require("next-logger"); // full console-patching

        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
            beforeSend: (event) => {
                event.tags = { ...event.tags };
                return event;
            },
        });
    } else if (process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
        });
    }
}

//export const onRequestError = Sentry.captureRequestError;
function errorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

function getHeader(headers: HeaderDict, headerName: string): string | null {
    const direct = headers[headerName];
    if (typeof direct === "string") {
        return direct;
    }
    if (Array.isArray(direct)) {
        return direct.join(",");
    }

    const lower = headers[headerName.toLowerCase()];
    if (typeof lower === "string") {
        return lower;
    }
    if (Array.isArray(lower)) {
        return lower.join(",");
    }

    return null;
}

function safeDecodeAndParse(routerStateRaw: string): Readonly<{ decodeOk: boolean; jsonOk: boolean }> {
    try {
        const decoded = decodeURIComponent(routerStateRaw);
        try {
            JSON.parse(decoded);
            return { decodeOk: true, jsonOk: true };
        } catch {
            return { decodeOk: true, jsonOk: false };
        }
    } catch {
        return { decodeOk: false, jsonOk: false };
    }
}

export const onRequestError: Instrumentation.onRequestError = async (error, errorRequest, errorContext) => {
    const message = errorMessage(error);

    if (message.includes("router state header")) {
        const routerState = getHeader(errorRequest.headers, "Next-Router-State-Tree");
        const userAgent = getHeader(errorRequest.headers, "user-agent");
        const cookie = getHeader(errorRequest.headers, "cookie");

        const stateLength = routerState ? routerState.length : 0;
        const { decodeOk, jsonOk } = routerState ? safeDecodeAndParse(routerState) : { decodeOk: false, jsonOk: false };

        console.error("[router-state] could not parse", {
            path: errorRequest.path, // inkluderer querystring: ?_rsc=...
            method: errorRequest.method,
            routerKind: errorContext.routerKind,
            routeType: errorContext.routeType,
            renderSource: errorContext.renderSource,
            revalidateReason: errorContext.revalidateReason,
            routePath: errorContext.routePath,
            routerStatePresent: Boolean(routerState),
            routerStateLength: stateLength,
            decodeOk,
            jsonOk,
            cookieLength: cookie ? cookie.length : 0,
            userAgent,
        });
    }

    // Behold Sentry sin standard capture (cast er ok her)
    Sentry.captureRequestError(error as Error, errorRequest, errorContext);
};
