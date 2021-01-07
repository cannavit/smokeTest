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
	* [Run example of smoke-test](#markdown-header-emphasis)
		* [Case: Pase Test](#markdown-header-emphasis)
        * [Use of Enviroment variable in Zipi-Smk-Service](#markdown-header-emphasis)

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
		
## Run example of smoke-test
You can use the following example to understand how it works in service. In this guide you will find two examples, one of a fault environment where the Smoke-Test service detects the problem and makes a report. The other example shows a case where the problem has been solved and the service passes the Smoke-test.

### Case: Pase Test
In this case, two services are shown that have to be connected in order to function. The first service is a database (MongoDB) and the second service is the Django backend, with a JWT authentication service.
Is neccesary for this example suite create one file with the name docker-compose.yml

#### 1) Run example_1 using docker-compose.yml (IN PROCESS*)
    # docker-compose.yml
    version: '3.7'
    services:
      database:
        image: mongo:latest
        container_name: database
        environment:
          MONGO_INITDB_ROOT_USERNAME: admin
          MONGO_INITDB_ROOT_PASSWORD: admin
          MONGODB_USERNAME: admin
          MONGODB_PASSWORD: admin
          MONGODB_DATABASE: admin
        ports:
          - 27017:27017
        networks:
          - host      

      backend:
        image: cannit/zipi_backend_example_1:latest
        container_name: backend
        ports:
          - 8000:8000
        depends_on:
          - database  
        environment:
          - DJANGO_ENV=docker  
        command:  >
              bash -c "python manage.py migrate
              && python manage.py shell -c \"from django.contrib.auth.models import User; User.objects.filter(username='admin1').exists() or User.objects.create_superuser('admin', 'admin1@example.com', 'admin')\"
              && python manage.py runserver 0.0.0.0:8000"
        networks:
          - host

      smoke-test: 
        image:  cannit/zipi_smktest:latest
        container_name: smoke-test
        depends_on:
          - backend
        privileged: true  
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock
        environment:
		  - ZIPI_CONFIGURATION='env_variable'
		  - RETRIES_NUMBER=0
		  - TO_BREAK_PIPELINE=false  
        networks:
          - host 

    networks:
      host:

#### 2) Run example_2 using docker-compose.yml (IN PROCESS*)

## Use of Enviroment variable in Zipi-Smk-Service

The following are the environment variables that can be modified in the service.

| ENVIROMENT VARIABLE NAME            | Default Value | Description  |
| :---                                | :---          | :---         | 
| ZIPI_CONFIGURATION                  | env_variable  |  You can select whether you want to read the configuration data from the config.json file (config_file) or from environment variables.          |
| MODE_CONNECT                        | docker        | Is possible select connect mode (docker or kubernetes)|
| WAIT_TIME_SECONDS                   | 10            | Waiting time for downed services | 
| RETRIES_NUMBER                      | 3             | Number of times the test will be repeated before rhombing the pipeline. To avoid the flaky test|
| TO_BREAK_PIPELINE                    | true         | Break the pipeline after finding a fault.

