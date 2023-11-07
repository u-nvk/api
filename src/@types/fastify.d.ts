import { Knex } from 'knex';

declare module 'fastify' {
  export interface FastifyInstance {
    cdb: Knex;
    envConfig: {
      VK_API_DOMAIN: string;
      VK_API_EXCHANGE_METHOD: string;
      VK_SERVICE_TOKEN: string;
      ACCESS_SECRET: string;
      DB_CONN: string;
    }
  }
}

// declare module '@fastify/request-context' {
//   interface RequestContextData {
//     decodedJwt: any
//   }
// }