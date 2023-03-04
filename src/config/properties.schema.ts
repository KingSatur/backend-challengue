import * as Joi from 'joi';

export const PropertiesValidationSchema = Joi.object({
  DATABASE_URL: Joi.required(),
  PORT: Joi.number().default(3005),
  CONTEXT_PATH: Joi.string().required(),
  BASE_FEE: Joi.number(),
});
