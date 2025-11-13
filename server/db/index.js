const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cleaningcrm",
  password: "Lakers0824",
  port: 5432,
});

module.exports = pool;
