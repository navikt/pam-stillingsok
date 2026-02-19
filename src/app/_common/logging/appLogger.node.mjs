import { logger as base } from "@navikt/next-logger";

const toError = (cause, fallbackMessage) => {
    if (cause instanceof Error) {
        return cause;
    }
    return new Error(fallbackMessage, { cause });
};

export const appLogger = {
    info(message, context) {
        if (context) {
            base.info(context, message);
        } else {
            base.info(message);
        }
    },

    warn(message, context) {
        if (context) {
            base.warn(context, message);
        } else {
            base.warn(message);
        }
    },

    error(message, context) {
        if (context) {
            base.error(context, message);
        } else {
            base.error(message);
        }
    },

    warnWithCause(message, cause, context) {
        const err = toError(cause, message);
        base.warn({ ...(context ?? {}), err }, message);
    },

    errorWithCause(message, cause, context) {
        const err = toError(cause, message);
        base.error({ ...(context ?? {}), err }, message);
    },

    httpError(message, failure, context) {
        const err = new Error(message, { cause: failure });
        base.error({ ...(context ?? {}), err, http: failure }, message);
    },
};
