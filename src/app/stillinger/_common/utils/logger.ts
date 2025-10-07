import winston, { format } from "winston";
import { getCallId } from "@/app/stillinger/_common/monitoring/getRequestCallId";
import { NAV_CALL_ID_TAG } from "@/app/stillinger/_common/monitoring/constants";
import { CallId } from "@/app/stillinger/_common/monitoring/callId";

const addCallId = winston.format((info) => {
    const localInfo = info;
    localInfo[NAV_CALL_ID_TAG] = getCallId();
    return localInfo;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(format.errors({ stack: true }), addCallId(), winston.format.json()),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

export function createLogger(callId: CallId) {
    const addCallId = format((info) => {
        const enriched = { ...info, [NAV_CALL_ID_TAG]: callId };
        return enriched;
    });

    return winston.createLogger({
        level: "info",
        format: format.combine(format.errors({ stack: true }), addCallId(), format.json()),
        transports: [new winston.transports.Console()],
        exceptionHandlers: [new winston.transports.Console()],
    });
}

export default logger;
