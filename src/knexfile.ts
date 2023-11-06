import type { Knex } from 'knex';
import 'dotenv/config';

// Update with your config settings.

console.log(process.env.dbConn);
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DB_CONN,
    },
  },
};

// module.exports = config;
export default config;
