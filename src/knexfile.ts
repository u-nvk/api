import type { Knex } from 'knex';
import 'dotenv/config';

if (!process.env.DB_CONN) {
  throw new Error('Passed invalid db conn env var');
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DB_CONN,
    },
  },
};

export default config;
