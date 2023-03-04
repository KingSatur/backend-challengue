import * as Joi from 'joi';

export const PropertiesValidationSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  PORT: Joi.number().default(3005),
  CONTEXT_PATH: Joi.string().required(),
  BASE_FEE: Joi.number().required(),
  BASE_RIDE_KM_FEE: Joi.number().required(),
  BASE_RIDE_MINUTE_FEE: Joi.number().required(),
  WAMPI_API_URL: Joi.link().required(),
  CURRENCY_CODE: Joi.string().required(),
  VENTURE_REFERENCE: Joi.string().required(),
  COUNTRY_CODE: Joi.string().required(),
});
