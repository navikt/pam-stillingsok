import winston, { format } from "winston";

export default winston.createLogger({
    level: "info",
    format: winston.format.combine(format.errors({ stack: true }), winston.format.json()),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});
