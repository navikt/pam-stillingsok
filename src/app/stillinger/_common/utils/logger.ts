import winston, { format } from "winston";
import { getCallId, NAV_CALL_ID_TAG } from "@/app/stillinger/_common/monitoring/callId";

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

export default logger;
