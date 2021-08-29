const Pool = require("pg").Pool;
const dotenv = require("dotenv");
const myEnv = dotenv.config();

const pool = new Pool({
  user: myEnv.parsed.DB_USER,
  host: myEnv.parsed.DB_HOST,
  database: myEnv.parsed.DB_DB,
  password: myEnv.parsed.DB_PASSWORD,
  port: myEnv.parsed.DB_PORT,
  max: 100,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // ssl: true // for azure only
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
