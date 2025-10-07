import winston, { format } from "winston";
import { getCallId } from "@/app/stillinger/_common/monitoring/getRequestCallId";
import { NAV_CALL_ID_TAG } from "@/app/stillinger/_common/monitoring/constants";
import { CallId } from "@/app/stillinger/_common/monitoring/callId";

const addCallId = winston.format((info) => {
    const localInfo = info;
    localInfo[NAV_CALL_ID_TAG] = getCallId();
    return localInfo;
});

const splatSymbol = Symbol.for("splat");
const mergeSplat = winston.format((info) => {
    const splat = info[splatSymbol] as unknown[] | undefined;
    if (Array.isArray(splat) && splat.length > 0) {
        const first = splat[0];
        if (first && typeof first === "object") {
            Object.assign(info, first); // <- legg meta på toppnivå
        }
        delete info[splatSymbol];
    }
    return info;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(format.errors({ stack: true }), addCallId(), mergeSplat(), winston.format.json()),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

export function createLogger(callId: CallId) {
    const addCallId = format((info) => {
        // format() er synkron – vi setter ren string
        // og gjør ingen sideeffekter her.
        // Bruk et lokalt objekt så vi ikke muterer "info" direkte.
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
