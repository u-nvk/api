/// <reference types="./@types/fastify.d.ts" />
import { fastify } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { identityController } from './services/identity/controller';
import {Knex, knex} from "knex";
import 'dotenv/config';
import cors from '@fastify/cors'
import { S } from 'fluent-json-schema';
import x from "@fastify/swagger";
import y from '@fastify/swagger-ui';

const server = fastify({
  logger: true,
})

const schema = S.object()
  .prop('VK_API_DOMAIN', S.string()).required()
  .prop('VK_API_EXCHANGE_METHOD', S.string()).required()
  .prop('VK_SERVICE_TOKEN', S.string()).required()
  .prop('ACCESS_SECRET', S.string()).required()
  .prop('DB_CONN', S.string()).required()

const options = {
  dotenv: {
    path: `${__dirname}/.env`,
  },
  schema: schema.valueOf(),
  confKey: 'envConfig',
  // data: process.env,
  // expandEnv: true,
}

// TODO: исправить
server.register(cors, {
  origin: '*',
  hook: 'preHandler',
});

server.register(fastifyEnv, options);

server.register(x, {
  swagger: {
    info: {
      title: 'UNVK-Api',
      description: 'Documentation for unvk api',
      version: '0.0.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  }
})

server.register(y, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})

server.register(identityController, { prefix: '/identity/api/v1' });

server.after()
  .then(() => {
    const pg: Knex = knex({
      client: 'pg',
      connection: {
        connectionString: server.envConfig.DB_CONN,
      },
      pool: { min: 0, max: 2 },
    });


    server.decorate('cdb', pg);

    server.listen({ host: '127.0.0.1', port: 3000 }, (err) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    });
  })
