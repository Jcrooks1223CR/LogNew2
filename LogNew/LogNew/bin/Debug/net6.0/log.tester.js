const os = require('os');
const logger = require("./log.manager");
const logDataTest_V0 = require("./logData0.json");
//const logDataTest_V1 = require("./logData1.json");
//const logDataTest_V2 = require("./logData2.json");
//const logDataTest_V3 = require("./logData3.json");

// testing based on default
//let logData = logDataTest_V0;
const platform = os.platform();

let logData = {};
logData.host = os.hostname();
logData.source = "TEST_V2"
logData.transaction = {};
logData.transaction.trace = ["TEST_V2","this","that"];
logData.transaction.route = '/v1/test/this/get';
logData.code = 354;
logData.http = {};
logData.http.request = {};
logData.http.request.headers = "test request header";
logData.http.request.data = "test request data";
logData.http.response = {};
logData.http.response.status = 200;
logData.http.response.headers = "test response header";
logData.http.response.data = "test respnse data";
logData.message = "get to the choppah!";
const cord = new Date(Date.now());

logData.transaction.correlationid = `${cord.getMilliseconds()}t${cord.getSeconds()}-${cord.getHours()}x${cord.getDay()}-${cord.getFullYear()}${cord.getMonth()}`;
let trace = new Error();
trace.name = "Trace";
logData.trace = trace.stack;

//logger.error(logData);
//logger.warn(logData);
//logger.info(logData);
//logger.http(logData);
//logger.verbose(logData);
logger.debug(logData);
//console.log(logData);
