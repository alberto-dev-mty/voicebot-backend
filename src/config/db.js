const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  user: env.db.user,
  host: env.db.host,
  password: env.db.password,
  database: env.db.database,
  port: env.db.port,
});

module.exports = pool;
