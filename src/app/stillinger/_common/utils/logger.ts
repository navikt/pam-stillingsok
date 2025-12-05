import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.json()),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

export default logger;
