import "server-only";
import logger from "./logger";

export type LogContext = {
    readonly component: string;
    readonly navCallId?: string;
};

export const withLogContext = (context: LogContext) => {
    return logger.child(context);
};
