const npmPackage = require("../package.json");

const { version } = npmPackage;
const versionNumberList = version.split(".");
versionNumberList.pop();

// eslint-disable-next-line no-console
console.log(versionNumberList.join("."));
