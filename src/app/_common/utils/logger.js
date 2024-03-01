import winston from "winston";
import { headers } from "next/headers";

export const NAV_CALL_ID_TAG = "Nav-CallId";

const addCallId = winston.format((info) => {
    info[NAV_CALL_ID_TAG] = headers().get(NAV_CALL_ID_TAG);
    return info;
});

const logger = winston.createLogger({
    format: winston.format.combine(addCallId(), winston.format.json()),
    transports: [new winston.transports.Console()],
});

export default logger;
