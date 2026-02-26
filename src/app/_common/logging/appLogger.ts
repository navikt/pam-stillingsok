import { logger as base } from "@navikt/next-logger";

type HttpFailure = Readonly<{
    readonly method: string;
    readonly url: string;
    readonly status: number;
    readonly statusText?: string;
}>;

type LogContext = Readonly<Record<string, unknown>>;

type AppLogger = Readonly<{
    info: (message: string, context?: LogContext) => void;
    debug: (message: string, context?: LogContext) => void;
    warn: (message: string, context?: LogContext) => void;
    error: (message: string, context?: LogContext) => void;

    warnWithCause: (message: string, cause: unknown, context?: LogContext) => void;
    errorWithCause: (message: string, cause: unknown, context?: LogContext) => void;
    httpError: (message: string, failure: HttpFailure, context?: LogContext) => void;
}>;

const appBase = base;

const toError = (cause: unknown, fallbackMessage: string): Error => {
    if (cause instanceof Error) {
        return cause;
    }
    return new Error(fallbackMessage, { cause });
};
//type LoggerWithLevel = Readonly<{ level: string }>;
/*const hasLevel = (logger: unknown): logger is LoggerWithLevel => {
    if (!logger || typeof logger !== "object") {
        return false;
    }
    return "level" in logger && typeof (logger as Record<string, unknown>).level === "string";
};*/
/*const ensureDebugLevel = (): void => {
    if (!hasLevel(appBase)) {
        return;
    }

    if (appBase.level !== "debug") {
        const previousLevel = appBase.level;
        appBase.level = "debug";
        appBase.info({ previousLevel, newLevel: "debug" }, "Hever log level pga ENABLE_DEBUG_LOGGING");
    }
};*/

export const appLogger: AppLogger = {
    /**
     * info:
     * Brukes for informasjonslogger i normal drift.
     * Legg evt. på små, stabile felt i `context` (unngå store payloads).
     */
    info(message, context) {
        if (context) {
            appBase.info(context, message);
        } else {
            appBase.info(message);
        }
    },

    /**
     * debug:
     * Brukes for debugging i normal drift.
     * Legg evt. på små, stabile felt i `context` (unngå store payloads).
     */
    debug(message, context) {
        if (context) {
            appBase.debug(context, message);
        } else {
            appBase.debug(message);
        }
        /*const decision = shouldLogDebugNow();
        if (!decision.enabled) {
            return;
        }

        ensureDebugLevel();

        const debugContext: LogContext = {
            ...(context ?? {}),
            debugLogging: { enabled: true, source: decision.source },
        };

        appBase.debug(debugContext, message);*/
    },

    /**
     * warn:
     * Brukes når noe er uventet, men appen kan fortsette (fallback/degradering/transient).
     * Hvis du har en faktisk exception (`catch`/event error), bruk `warnWithCause` for å få stacktrace på `err`.
     */
    warn(message, context) {
        if (context) {
            appBase.warn(context, message);
        } else {
            appBase.warn(message);
        }
    },

    /**
     * warnWithCause:
     * Som `warn`, men med underliggende årsak (`cause`). Normaliseres til `Error` og logges på `err`.
     * Bruk når du har en exception. Ikke bruk for feillister (logg dem i `context` og bruk `warn`).
     */
    warnWithCause(message: string, cause: unknown, context?: LogContext) {
        const err = toError(cause, message);
        appBase.warn({ ...(context ?? {}), err }, message);
    },

    /**
     * error:
     * Brukes når noe feiler og dere ikke kan levere forventet resultat, men uten en konkret exception.
     * Typisk når du har feilstruktur/feillister (logg dem i `context`).
     * Hvis du har en exception, bruk `errorWithCause` for stacktrace på `err`.
     */
    error(message, context) {
        if (context) {
            appBase.error(context, message);
        } else {
            appBase.error(message);
        }
    },

    /**
     * errorWithCause:
     * Som `error`, men med underliggende exception/årsaken (`cause`). Normaliseres til `Error` og logges på `err`.
     * Standardvalg i `catch`-blokker. Ikke bruk for feillister (logg dem i `context` og bruk `error`).
     */
    errorWithCause(message, cause, context) {
        const err = toError(cause, message);
        appBase.error({ ...(context ?? {}), err }, message);
    },

    /**
     * httpError:
     * For HTTP-feil mot upstream. Logg kun små, strukturerte felter (method/url/status/statusText) i `failure`.
     * Unngå å logge hele `Response`. `failure` legges også i `err.cause`.
     */
    httpError(message, failure, context) {
        const err = new Error(message, { cause: failure });
        appBase.error({ ...(context ?? {}), err, http: failure }, message);
    },
};
