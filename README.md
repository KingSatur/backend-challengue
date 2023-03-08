# Ride api, api to request rides

This a simple api to request rides created with nestjs as backend framework, prisma as orm, postgresql as database and layered architecture with controller, service and prisma as repository layer. Below you can find the order in which the resource execution should be, to check the expected bussines behavior:

1. POST: auth/login, Login as a RIDER (person who request for a ride) or as a DRIVER (person who drive to the destination). This endpoint return a token used to subsequent calls in order to check authentication.
2. POST: /payment/method, Create a payment method as a RIDER, using an already created credit card token on wompi platform.
3. POST: /ride, Request for a ride as a RIDER given a started position (composed by latitude and longitude) and has the following rules:
   - If the rider who requests for a ride has another unfinished ride, it will respond as a bad request.
   - If the rider who requests for a ride does not have a created payment method, it will respond as a bad request.
4. PUT: /ride/{rideId}, Finish a ride by its database id. This endpoint has the following rules:
   - If the DRIVER of this rideId is not the same as the decoded in the jwt, it will respond as a bad request.
   - If there is no a ride with that rideId, it will respond as a not found response.
   - If the ride was already finished, it will respond as a bad request.

## 1. Getting started

---

### 1.1 Installations

Before starting, please make sure you have the following tools in your machine:

- docker engine
- docker-compose executable
- git
- nodejs (to run tests)
- npm (to run tests)

If you want to test the application, you should use an http client such as:

- insomnia
- postman

### 1.2 Download project

In order to download the project, you should create a directory where you want to store the project and execute the following command

```
  git clone https://github.com/KingSatur/backend-challengue.git
```

### 1.3 Configure environment variables

The next thing is create your environment variables in order to run the project correctly, under the project directory, you can find a file called '.env.example' where you can check the environment variables needed to run the project. Below you can understand the importance of each environment variable

| variable               | description                                                                                 | is required? | type   |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------ | ------ |
| CONTEXT_PATH           | Initial path required to consume the endpoints. MUST BE: **ride-api**                       | YES          | String |
| PORT                   | Port where the application is going to be listining for requests                            | YES          | number |
| BASE_FEE               | Base tax for each ride                                                                      | YES          | number |
| BASE_RIDE_KM_FEE       | Base fee for each kilometer traveled                                                        | YES          | number |
| BASE_RIDE_MINUTE_FEE   | Base fee for each minute traveled                                                           | YES          | number |
| WOMPI_API_URL          | Base url of wompi api                                                                       | YES          | string |
| CURRENCY_CODE          | Currency to convert the amounts, for now is only working with COP. MUST BE: **COP**         | YES          | string |
| VENTURE_REFERENCE      | Unique reference for each company on the wompi platform                                     | YES          | string |
| CARD_TOKEN             | Created credit card token to simulate payment method creation                               | YES          | string |
| VENTURE_PUBLIC_KEY     | Generated venture public key to get acceptance tokens, this can be found at wompi platform  | YES          | string |
| VENTURE_PRIVATE_KEY    | Generated venture private key to get acceptance tokens, this can be found at wompi platform | YES          | string |
| COP_TO_USD_EQUIVALENCE | Rate to convert from cop to usd currency                                                    | YES          | number |
| JWT_SECRET             | Secret to login using jwt                                                                   | YES          | string |
| ENCRYPT_RONDS          | Number of salts to encrypt user password                                                    | NO           | number |
| DATABASE_USER          | database user. REQUIRED when executing with docker-compose                                  | YES          | string |
| DATABASE_PASS          | database password. REQUIRED when executing with docker-compose                              | YES          | string |
| DATABASE_HOST          | database host. REQUIRED when executing with docker-compose. MUST BE: database-dev           | YES          | string |
| DATABASE_PORT          | database port. REQUIRED when executing with docker-compose. MUST BE: 5432                   | YES          | string |
| DATABASE_NAME          | database name. REQUIRED when executing with docker-compose                                  | YES          | string |
| NODE_ENV               | environment                                                                                 | YES          | string |

and here is an example of how the .env file should look like:

```
CONTEXT_PATH=rides-api
PORT=5000
BASE_FEE=3500
BASE_RIDE_KM_FEE=1000
BASE_RIDE_MINUTE_FEE=200
WOMPI_API_URL=https://sandbox.wompi.co/v1
CURRENCY_CODE=COP
VENTURE_REFERENCE=0-1i2okmJNH192u9-0lmk
COUNTRY_CODE=CO
CARD_TOKEN=pub_prod_Kw4aC0rZVgLZQn209NbEKPuXLzBD28Zx
VENTURE_PUBLIC_KEY=pub_prod_Kw4aC0rZVgLZQn209NbEKPuXLzBD28Zx
VENTURE_PRIVATE_KEY=prv_prod_434092Xa65F54dd6a181D1f87DFa03CzS
COP_TO_USD_EQUIVALENCE=0.00021
JWT_SECRET=GjBXWXlsXMt8RweNxx0x9Q1VyXIEUMG1
ENCRYPT_RONDS=10
DATABASE_USER=postgres
DATABASE_PASS=root
DATABASE_HOST=database-dev
DATABASE_PORT=5432
DATABASE_NAME=ride-db
NODE_ENV=dev
```

### 1.4 Run the application with docker-compose tool

Once you have all the required variables values, you are ready to run the application by using the powerfull docker tool and docker-compose. You can lanch the api using the comand below

```
  docker-compose -f docker-compose.dev.yml --env-file .env up --build
```

It is important to know that "-f" flag is to indicate to docker-compose, which file use to spin up the containers, and the "--env-file" is to indicate which .env file is going to be taken to fill the required environment variables, which can also be found in the environment block of docker-compose.dev.yml

```
# config properties
...
    environment:
      DATABASE_URL: postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public&pool_timeout=0
      CONTEXT_PATH: ${CONTEXT_PATH}
      PORT: ${PORT}
      BASE_FEE: ${BASE_FEE}
      BASE_RIDE_KM_FEE: ${BASE_RIDE_KM_FEE}
      BASE_RIDE_MINUTE_FEE: ${BASE_RIDE_MINUTE_FEE}
      WOMPI_API_URL: ${WOMPI_API_URL}
      CURRENCY_CODE: ${CURRENCY_CODE}
      VENTURE_REFERENCE: ${VENTURE_REFERENCE}
      COUNTRY_CODE: ${COUNTRY_CODE}
      CARD_TOKEN: ${CARD_TOKEN}
      VENTURE_PUBLIC_KEY: ${VENTURE_PUBLIC_KEY}
      VENTURE_PRIVATE_KEY: ${VENTURE_PRIVATE_KEY}
      COP_TO_USD_EQUIVALENCE: ${COP_TO_USD_EQUIVALENCE}
      JWT_SECRET: ${JWT_SECRET}
      ENCRYPT_RONDS: ${ENCRYPT_RONDS}
      DATABASE_USER: ${DATABASE_USER}
      DATABASE_PASS: ${DATABASE_PASS}
      DATABASE_HOST: ${DATABASE_HOST}
      DATABASE_PORT: ${DATABASE_PORT}
      DATABASE_NAME: ${DATABASE_NAME}
...
# config properties
```

With the above steps, you should have the application running on the port your configured on the .env file.

## 2. Testing project

The application database was seeded with dummy data in order to test the api. Below we can find a table for drivers and riders, in total, there were created 3 drivers and 2 riders.

| email                       | password       | role   | city     | state     | current latitude | current longitude |
| --------------------------- | -------------- | ------ | -------- | --------- | ---------------- | ----------------- |
| Carter_Littel11@hotmail.com | riderPassword  | RIDER  | Medellin | Antioquia | 77.7104          | 22.7235           |
| ttel11@hotmail.com          | riderPassword  | RIDER  | Bogotá   | Bogotá    | 77.7104          | 22.7235           |
| Wiley_Collier48@yahoo.com   | driverPassword | DRIVER | Medellin | Antioquia | -71.0335         | 17.8195           |
| Merritt31@hotmail.com       | driverPassword | DRIVER | Bogotá   | Bogotá    | -73.7348         | -68.7797          |
| Hildegard96@hotmail.com     | driverPassword | DRIVER | Medellin | Antioquia | 25.1306          | -120.432          |

### 2.1 Open api docs

In order to test the project, there is an open-api documentation which you can access by going to the port where your application is running (the PORT key defined in your .env file), let's say in the port 5000, so you go to

```
  http://localhost:5000/docs
```

in you browser, and it will display the swagger interface where you can check how to consume the endpoints and what the endpoints service will respond.

### 2.2 Postman documentation

In the case you have installed postman on your machine, you can import the following files located in the project, into postman application, which provides the collection and environment required to consume the different endpoints

```
  ride-api-dev-environment.postman_environment.json --> Environment
  ride-api.postman_collection ---> Collection
```

## 3. Project structure and insights

Below we have the project structure tree, composed by 5 modules:

- app module, entry module of the application
- auth module, in chargue of the authentication concerns.
- payment module, handle the creation of payment.
- ride module who create rides, finish rides along with the creation of a transaction at wompi.
- shared module who own the wompi service, who communicates with the wompi api. It also ha other services, and guards to share across the different application modules.

```
├── src
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── dto
│   │   │   ├── login-request.ts
│   │   │   └── login-response.ts
│   │   ├── entities
│   │   │   └── auth.entity.ts
│   │   └── stategy
│   │       └── jwt.strategy.ts
│   ├── config
│   │   ├── properties.config.ts
│   │   └── properties.schema.ts
│   ├── constants
│   │   ├── exception.message.ts
│   │   ├── ride-state.enum.ts
│   │   └── role.enum.ts
│   ├── filter
│   │   └── excepion.handler.ts
│   ├── main.ts
│   ├── payment
│   │   ├── dto
│   │   │   ├── create-payment-request.dto.ts
│   │   │   └── create-payment-response.dto.ts
│   │   ├── payment.controller.spec.ts
│   │   ├── payment.controller.ts
│   │   ├── payment.module.ts
│   │   ├── payment.service.spec.ts
│   │   └── payment.service.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── ride
│   │   ├── dto
│   │   │   ├── create-ride-request.dto.ts
│   │   │   ├── create-ride-response.dto.ts
│   │   │   ├── finish-ride-request.dto.ts
│   │   │   └── finish-ride-response.dto.ts
│   │   ├── ride.controller.spec.ts
│   │   ├── ride.controller.ts
│   │   ├── ride.module.ts
│   │   ├── ride.service.spec.ts
│   │   ├── ride.service.ts
│   └── shared
│       ├── decorators
│       │   ├── has-roles.decorator.ts
│       │   └── open-api-decorator.ts
│       ├── dto
│       │   ├── index.ts
│       │   ├── service-response-notification.ts
│       │   └── service-response.ts
│       ├── exception
│       │   └── ride-management-exception.ts
│       ├── guard
│       │   ├── jwt.guard.ts
│       │   └── role.guard.ts
│       ├── shared.module.ts
│       ├── swagger
│       │   └── sample.ts
│       └── wompi
│           ├── dto
│           │   ├── acceptance-token.ts
│           │   ├── create-transaction.ts
│           │   └── payment-dto.ts
│           ├── wompi.service.spec.ts
│           └── wompi.service.ts

```

### 3.1 Testing summary

In respect of testing, each service and controller has its own testing file, who tests the methods and mocks dependencies using approach such as spys and stubs. In the case of e2e testing, there was a created a file to execute all the e2e test with the real layers, however, the prisma layer and wompi service layer (who communicates with wompi service) were mocked due to the need no to depend on the availabilty of external service, and dont create database just for e2e file execution, which in some case are needed.

#### 3.2 Running unitary tests

To execute unitary tests, you have to execute the following commands

```
## Download all the required dependencies required in the package.json to be able to run the tests
npm i

```

```
## Run unitary tests
npm run test
```

### 3.3 Running e2e test

The next step will be run the end to end test. For that, you can execute.

```
npm run test:e2e
```
