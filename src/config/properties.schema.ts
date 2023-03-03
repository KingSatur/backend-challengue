import * as Joi from 'joi';

export const PropertiesValidationSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  PORT: Joi.number().default(3005),
  MICROSERVICE_PORT: Joi.number().default(4502),
  AUTH_SERVER_URL: Joi.string().required(),
  REALM: Joi.string().required(),
  CLIENT_ID: Joi.string().required(),
  SECRET: Joi.string().required(),
  OPERATORS_BY_COMPANY_QUANTITY: Joi.number().min(1).default(1),
});
