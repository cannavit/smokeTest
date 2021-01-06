<!-- TODO Define Badge -->
[![Docker](https://img.shields.io/badge/-Docker-3589C4?style=flat-square&labelColor=3589C4&logo=docker&logoColor=white&link=https://www.docker.com/)](https://hub.docker.com/r/cannit/zipi_smktest)
[![Kubernetes](https://img.shields.io/badge/-kubernetes-3875A0?style=flat-square&logo=kubernetes&logoColor=white&link=https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)
[![NodeJS](https://img.shields.io/badge/-NodeJs-3CA80B?style=flat-square&logo=nodejs&logoColor=white&link=https://nodejs.org/en/)](https://nodejs.org/en/)
[![Zipi-Smoke-Test](https://img.shields.io/badge/-web-black?style=flat-square&labelColor=3589C4&logo=web&logoColor=white&link)](https://cecilio-cannav.github.io/zipi-smkTest/)
[![GitHub](https://img.shields.io/badge/-github-black?style=flat-square&labelColor=black&logo=github&logoColor=white&link)](https://github.com/cecilio-cannav/zipi-smkTest)

<p align="left" src="https://cecilio-cannav.github.io/zipi-smkTest/">
  <img src="https://raw.githubusercontent.com/cecilio-cannav/zipi-smkTest/master/docs/zipi.png" width="256" title="Smoke-Test">
</p>

Zipi-SmokeTest: 
====================
Zipi-SmkTest: Is a service developed to avoid sporadic failures in development environments. Applying Smoke-Test techniques. The service performs verifications of environments composed of micro-services. It is a great alternative to remediate sporadic failures that cause wasted time in later stages of development.

Keyworld: Smoke Test, Sporadic failures, automatic, test

Content:
===================

* [Smoke Test Coverage](#markdown-header-span-elements) 
* [How use the service with Docker](#markdown-header-span-elements)
	* [Run service](#markdown-header-emphasis)
	* [Run example of smoke-test (Pass Case)](#markdown-header-emphasis)



# Smoke Test Coverage:  

| Test Coverage                       | Docker                       | Kubernetes  |
| :---                                | :---                         | :---:       | 
| Check TCP-Network                   | OK                           |  -          |
| Check Volume Access                 | OK                           |  -          |
| Check Logs                          | OK                           |  -          |
| Check EndPoints                     | OK                           |  -          |
| Check Cross Connection              | OK                           |  -          |
| Check List of EndPoints             | OK                           |  -          |
| Monitoring Resources                | OK                           |  -          |



# How use the service with Docker

## Run service 
     docker run -d --name=smktest cannit/zipi_smktest:latest
		
## Run example of smoke-test (Pass Case)
You can use the following example to understand how it works in service. In this guide you will find two examples, one of a fault environment where the Smoke-Test service detects the problem and makes a report. The other example shows a case where the problem has been solved and the service passes the Smoke-test.
