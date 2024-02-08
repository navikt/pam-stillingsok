const winston = require("winston");

// Todo: Trenger vi denne loggeren, er det nødvendig å bruke winston npm pakke?
const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

module.exports = { logger };
