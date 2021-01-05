let connetionCommand = require('../dictionary/connetionCommand.json')
var shell = require('shelljs')

const { weekDayNoLeapSecs } = require('timezonecomplete')

async function getIp() {
  if (global.config.MODE_CONNECT === 'manual') {
    servicesAdress = global.config.PING.SERVICES
  }
  if (global.config.MODE_CONNECT === 'docker') {

    var servicesAdress = shell.exec(connetionCommand.docker.SERVICE, {silent: true})
    
    servicesAdress = servicesAdress.stdout

    //! Remove name of smoke-test service. 
    let deleteWorld = global.config.project.name
    servicesAdress = servicesAdress.replace(deleteWorld,'')
    servicesAdress = servicesAdress.replace('"",','')  

    servicesAdress =
      '[' + servicesAdress.substr(0, servicesAdress.length - 2) + ']'

    servicesAdress = eval(servicesAdress)
  }
  if (global.config.MODE_CONNECT === 'kubectl') {
    var servicesAdress = shell.exec(connetionCommand.docker.SERVICE, {silent: true})
    
    //! Remove name of smoke-test service.  
    let deleteWorld = global.config.project.name
    servicesAdress = servicesAdress.replace(deleteWorld,'')
    servicesAdress = servicesAdress.replace('"",','')
       
    servicesAdress = servicesAdress.stdout
  }

  return servicesAdress
}

// GET PORTS FROM DIFERENTS FORMATS:
async function getPort() {
  let SERVICE = await getIp()

  if (global.config.MODE_CONNECT === 'manual') {
    listPorts = global.config.PING.SERVICES
  }
  if (global.config.MODE_CONNECT === 'docker') {

    var ports = shell.exec(connetionCommand.docker.PORT, {silent: true})
    
    ports = ports.stdout

    //! Remove empty port .  
    ports = ports.replace('"",','')

    ports = '[' + ports.substr(0, ports.length - 2) + ']'
    ports = eval(ports)

    // GET MULTIPORTS
    var listPorts = []
    for (let index = 0; index < SERVICE.length; index++) {
      var service = SERVICE[index]
      var port = ports[index]
      var search1 = 1
      var search2 = 1
      var search3 = 1
      var search4 = 1
      var cont = 0

      while (search4 !== -1) {
        cont = cont + 1

        // Fromat example 0.0.0.0:2424->2424/tcp, 0.0.0.0:2480->2480/tcp
        search1 = port.search('>') - 1
        search3 = port.search(':') + 1
        search4 = port.search(',')
        search2 = port.search('->/tcp')

        if (search2 === -1) {
          search2 = 0
        }

        // Format example 4010-4011/tcp

        if (search3 === 0) {
          search3 = 0
          search1 = port.search('-')
        }

        var portSingle = port.substring(search3, search1)
        port = port.substring(search4 + 1, port.length)

        listPorts.push({ service: service, ip: '0.0.0.0', port: portSingle })
      }
    }
  }
  if (global.config.MODE_CONNECT === 'kubectl') {
    var ports = shell.exec(connetionCommand.docker.PORT, {silent: true})
    listPorts = servicesportsAdress.stdout
  }

  return listPorts
}

module.exports.getPort = getPort
module.exports.getIp = getIp
