import * as Joi from 'joi';

export const PropertiesValidationSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  PORT: Joi.number().default(3005),
  CONTEXT_PATH: Joi.string().required(),
  BASE_FEE: Joi.number().required(),
  BASE_RIDE_KM_FEE: Joi.number().required(),
  BASE_RIDE_MINUTE_FEE: Joi.number().required(),
  WOMPI_API_URL: Joi.string().required(),
  CURRENCY_CODE: Joi.string().required(),
  VENTURE_REFERENCE: Joi.string().required(),
  COUNTRY_CODE: Joi.string().required(),
  CARD_TOKEN: Joi.string().required(),
  VENTURE_PUBLIC_KEY: Joi.string().required(),
  VENTURE_PRIVATE_KEY: Joi.string().required(),
  COP_TO_USD_EQUIVALENCE: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  ENCRYPT_RONDS: Joi.number().required().max(20),
});
