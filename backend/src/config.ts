export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
    driver: process.env.DATABASE_DRIVER,
  },
  debug: process.env.DEBUG,
});
