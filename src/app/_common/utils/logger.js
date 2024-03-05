import winston from "winston";
import { getCallId, NAV_CALL_ID_TAG } from "@/app/_common/monitoring/callId";

const addCallId = winston.format((info) => {
    info[NAV_CALL_ID_TAG] = getCallId();
    return info;
});

const logger = winston.createLogger({
    format: winston.format.combine(addCallId(), winston.format.json()),
    transports: [new winston.transports.Console()],
});

export default logger;
