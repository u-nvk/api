/// <reference types="./@types/fastify.d.ts" />
import { fastify } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { identityController } from './services/identity/controller';
import {Knex, knex} from "knex";
import 'dotenv/config';
import cors from '@fastify/cors'
import { S } from 'fluent-json-schema';

console.log(__dirname)

const server = fastify({
  logger: true,
})

const schema = S.object()
  .prop('VK_API_DOMAIN', S.string()).required()

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
})

const pg: Knex = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_CONN,
  },
  pool: { min: 0, max: 2 },
});


server.decorate('cdb', pg);

server.register(fastifyEnv, options)

server.register(identityController, { prefix: '/identity/api/v1' })

server.after()
  .then(() => {
    console.log(server.envConfig);
    server.listen({ port: 3000 }, (err) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    });
  })
