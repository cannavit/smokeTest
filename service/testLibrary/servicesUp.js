const getCommand = require("../dictionary/getCommand");
const Table      = require("tty-table");
const ora        = require("ora");

async function status() {
  let keyWold = 'Exited'
  //! Get service down
  let servicesName     = await getCommand.getListResutls("STATUS");
  let servicesDisabled = await getCommand.searchInOutput("STATUS", keyWold);
  
  //! Get service name
  let Name = await getCommand.getListResutls("SERVICE");
  
  //!Control is all services exist inside to Container Manager: 
  let services        = global.config.SERVICES_NAME
  let lackService     = false
  let nameLackService = []

  if (services !== undefined) {

    for (const key in services) {

      serviceConfigName = services[key].service

      if (!Name.includes(serviceConfigName)){
            lackService = true
            nameLackService.push(serviceConfigName)
      }

    }

  }
  
  let tableData = [];
  if (lackService) {
    for (const key in nameLackService) {
      servicesDisabled.detectWord = true
      tableData.push({
        serviceName: nameLackService[key],
        description: "No found service inside to Manager",
        activeService: "False" 
      })

    }
    
  } 

  //! Remove name of smoke-test service.  
  let smokeTestContainerName = global.config.project.name

  //! Create Table:
  for (const key in Name) {
    let name = Name[key];
    let servicesname = servicesName[key];
    let existKeyWold = servicesname.search(keyWold);
    let existD

    if (existKeyWold !== -1 && name != smokeTestContainerName) {
      existD = false;
    } else {
      existD = true;
    }
    
    if (name != smokeTestContainerName) {

      tableData.push({
        serviceName: name,
        description: servicesname,
        activeService: String(existD),
      });
    
    }

  }

  //! Add spinner.
  let spinner = ora("Check if all services are UP").start();

  if (!servicesDisabled.detectWord) {
    spinner.succeed();
  } else {
    spinner.fail();
  }
  //! Activate table if test fail.

  if (servicesDisabled.detectWord) {
    let header = [
      { value: "serviceName", width: 25, alias: "Service Name" },
      { value: "description", width: 40, align: "rigth", alias: "Description service-down" },
      {
        alias: "Service Up",
        value: "activeService",
        width: 15,
        color: "red",
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
    const t3 = Table(header, tableData);
    console.log(t3.render());
  }

  return servicesDisabled;
}

module.exports.status = status;
// status()