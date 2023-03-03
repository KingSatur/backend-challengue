export const Properties = () => ({
  environment: process.env.NODE_ENV || 'local',
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT || 4501,
  microservice_port: process.env.MICROSERVICE_PORT || 4502,
  authServerUrl: process.env.AUTH_SERVER_URL,
  realm: process.env.REALM,
  clientId: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  operatorsByCompanyQuantity: process.env.OPERATORS_BY_COMPANY_QUANTITY,
});
