const npmPackage = require('../package.json');

const { version } = npmPackage;
let versionNumberList = version.split('.');
versionNumberList.pop();

console.log(versionNumberList.join('.'));
