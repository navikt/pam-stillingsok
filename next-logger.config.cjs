const { backendLogger } = require("@navikt/next-logger");

module.exports = {
    logger: (config) =>
        backendLogger(config).child({ source: "next", subsystem: "next-runtime" }, { msgPrefix: "[Next] " }),
};
