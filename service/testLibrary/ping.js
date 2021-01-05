const ping = require("pingman");
const log = require("../../util/logger")("editionService");
const tc = require("timezonecomplete");

var shell = require("shelljs");
const _ = require("lodash");
const env = process.env.NODE_ENV || "dev";
let config = require("../../config.json");


// LOGS
const ora = require("ora");
const Table2 = require("cli-table");
const createTable = require("../../util/table");

global.config = _.merge(config["dev"], config[env]);
// LOGS
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function check(service) {
  let response = "";
  try {
    // response = await ping(service);

    var noTrys = 1;
    if (service.port !== "") {

      //var ctpPingRequest = service.ip + ":" + service.port;
      var ctpPingRequest = service.service;
      //var ctpPingRequest = "www.google.com";

      pingOut = await shell.exec(" ping -c " + noTrys + " " + ctpPingRequest, { silent: false });

      // Check if exist connections
      if (pingOut.code === 0) {
        var alive = true;
      } else {
        var alive = false;
      }

      if (alive) {
        log.info("PING: " + alive + " | TRY NO: " + noTrys + " | HOST: " + ctpPingRequest + " |");
      } else {
        log.warn("PING: " + alive + " | TRY NO: " + noTrys + " | HOST: " + ctpPingRequest + " |");
        response.host = service;
        alive = false;
      }
    } else {
      alive = false;
    }
  } catch (error) {
    log.error("Ping ERROR: " + error + " " + service);
    alive = false;
  }
  return alive;
}

async function checkMultiService(SERVICES) {
  // Evaluate diferets services for to check it.
  var start = new tc.nowUtc();
  var duration = 0; // Reset time
  var trys = 0;
  var PASS_TEST = [];
  var START = true;
  var STOP = false;
  var SUCCESS = 0;
  var cont2 = 0;
  var successPing = true;
  var passSelection = true;
  let results = [];
  
  let logsSpinner = ora("Verify results network connection with PING request").start();

  log.info("WAIT_TIME_SECONDS: ", global.config.WAIT_TIME_SECONDS);

  while (!STOP) {
    if (duration > global.config.WAIT_TIME_SECONDS) {
      STOP = true;
    }

    // code block to be executed
    for (let index = 0; index < SERVICES.length; index++) {
      trys = trys + 1;
      cont2 = cont2 + 1;

      if (PASS_TEST.indexOf(index) === -1 || START) {
        START = false;

        const service = SERVICES[index];

        if (global.config.MODE_CONNECT === "manual") {
          serviceFilter = service.ip;
          serviceName = service.service;
        }
        if (global.config.MODE_CONNECT === "docker") {
          serviceFilter = service.ip + ":" + service.port;
          serviceName = service.service;
          
        }

        alive = await check(service);

        if (alive) {
          log.info(
            "SERVICE:" +
              serviceName +
              "| PING: " +
              alive +
              " | TRY NO: " +
              trys +
              " | HOST: " +
              service.service +
              " | TIME: " +
              duration
          );
          PASS_TEST.push(index);
          SUCCESS = SUCCESS + 1;
          if (SUCCESS === SERVICES.length) {
            STOP = true;
          }
        } else {
          log.warn(
            "SERVICE:" +
              serviceName +
              "| PING: " +
              alive +
              " | TRY NO: " +
              trys +
              " | HOST: " +
              service.service +
              " | TIME: " +
              duration
          );
        }

        if (!alive && passSelection) {
          successPing = false;
          passSelection = false;
        }


        // Get time difference
        var end = new tc.nowUtc();
        var duration = end.diff(start);
        duration = duration.seconds();

        // results.push(["tcp_network", service.service, service.ip, service.port, alive]);

        results.push({
          TEST: "tcp_network",
          SERVICE: service.service,
          IP: service.ip,
          PORT: String(service.port),
          SUCCESS: String(alive),
        });
      }
      sleep(1000);
    }

    // Print status of the test
    if (successPing) {
      logsSpinner.succeed();
    } else {
      logsSpinner.fail();
    }
    return { results, successPing };
  }
}

// Run Services..
const selectService = require("./selectService");

const Table = require("tty-table");
const { result } = require("lodash");

async function checkNetwork() {
  // Check ntc net
  // Print table result.
  let services = global.config.SERVICES_NAME

  if (services === undefined) {

    services = await selectService.getPort();
    
    log.warn(' USE SERVICES NAME OF AUTOMATIC WAY')
 
  } else {
 
    log.warn(' USE SERVICES NAME OF CONFIG.JSON')
 
  }
  
  
  results = await checkMultiService(services);

  // Print table results only if test fail
  if (!results.successPing) {
    let header = [
      { value: "TEST", width: 20, alias: "Test method" },
      { value: "SERVICE", width: 30, alias: "Service Name" },
      { value: "IP", width: 20, alias: "IP" },
      { value: "PORT", width: 15 },
      {
        value: "SUCCESS",
        width: 15,
        alias: "Pass Test",
        formatter: function (value) {
          if (value === "true") {
            value = this.style(value, "bgGreen", "black");
          } else {
            value = this.style(value, "bgRed", "white");
          }
          return value;
        },
      },
    ];

    const t3 = Table(header, results.results);
    console.log(t3.render());
  }
  return results;
}

module.exports.checkNetwork = checkNetwork;
module.exports.checkMultiService = checkMultiService;
