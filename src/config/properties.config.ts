export const Properties = () => ({
  environment: process.env.NODE_ENV || 'local',
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT || 4501,
  base_ride_fee: process.env.BASE_FEE,
  base_ride_km_fee: process.env.BASE_RIDE_KM_FEE,
  base_ride_minute_fee: process.env.BASE_RIDE_MINUTE_FEE,
  wampi_url: process.env.WAMPI_API_URL,
  currency_code: process.env.CURRENCY_CODE,
  venture_reference: process.env.VENTURE_REFERENCE,
  country_code: process.env.COUNTRY_CODE,
});
