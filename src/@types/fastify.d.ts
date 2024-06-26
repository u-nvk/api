import { Knex } from 'knex';
import { DecodedJwtToken } from '@libs/common';

declare module 'fastify' {
  export interface FastifyInstance {
    cdb: Knex;
    verifyJwtIdentity: any;
    envConfig: {
      VK_API_DOMAIN: string;
      VK_API_EXCHANGE_METHOD: string;
      VK_API_GET_PROFILE_INFO_METHOD: string;
      VK_SERVICE_TOKEN: string;
      ACCESS_SECRET: string;
      ACCESS_TOKEN_EXPIRES: string;
      DB_CONN: string;
      HOST: string;
      PORT: number;
    }
  }
}

declare module '@fastify/request-context' {
  interface RequestContextData {
    decodedJwt: DecodedJwtToken;
  }
}
