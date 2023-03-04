export const Properties = () => ({
  environment: process.env.NODE_ENV || 'local',
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT || 4501,
  base_fee: process.env.BASE_FEE,
});
