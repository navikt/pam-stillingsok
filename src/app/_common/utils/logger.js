import winston from "winston";

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

export default logger;
