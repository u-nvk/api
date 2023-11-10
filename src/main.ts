/// <reference types="./@types/fastify.d.ts" />
import { fastify, FastifyReply, FastifyRequest } from 'fastify';
import { fastifyEnv } from '@fastify/env';
import { Knex, knex } from 'knex';
import 'dotenv/config';
import cors from '@fastify/cors';
import { S } from 'fluent-json-schema';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyAuth from '@fastify/auth';
import fastifyRequestContext from '@fastify/request-context';
import { JwtVerifier } from './libs/jwt';
import { identityController } from './services/identity/controller';
import { profileController } from './services/profile';
import { DecodedJwtToken } from './libs/common';

const server = fastify({
  logger: true,
});

server.register(fastifyRequestContext);

const schema = S.object()
  .prop('VK_API_DOMAIN', S.string()).required()
  .prop('VK_API_EXCHANGE_METHOD', S.string())
  .required()
  .prop('VK_SERVICE_TOKEN', S.string())
  .required()
  .prop('ACCESS_SECRET', S.string())
  .required()
  .prop('DB_CONN', S.string())
  .required()
  .prop('VK_API_GET_PROFILE_INFO_METHOD', S.string())
  .required()
  .prop('HOST', S.string())
  .required()
  .prop('PORT', S.number())
  .required();

const options = {
  dotenv: {
    path: `${__dirname}/.env`,
  },
  schema: schema.valueOf(),
  confKey: 'envConfig',
};

// TODO: исправить
server.register(cors, {
  origin: '*',
  hook: 'preHandler',
});

server.register(fastifyEnv, options);

server.register(swagger, {
  swagger: {
    info: {
      title: 'UNVK-Api',
      description: 'Documentation for unvk api',
      version: '0.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

server.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest(request, reply, next) { next(); },
    preHandler(request, reply, next) { next(); },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => swaggerObject,
  transformSpecificationClone: true,
});

server
  .decorate('verifyJwtIdentity', (req: FastifyRequest, rep: FastifyReply, done: any) => {
    try {
      const jwt: string | undefined = req.headers.authorization;

      if (!jwt) {
        rep.status(401);
        done(new Error('Not authorization header'));
        return;
      }

      try {
        const v = new JwtVerifier<DecodedJwtToken>(jwt, req.server.envConfig.ACCESS_SECRET);
        v.isValid()
          .then((decoded: DecodedJwtToken) => {
            req.requestContext.set('decodedJwt', decoded);
            done();
          })
          .catch((e) => {
            done(new Error('Invalid token'));
          });
      } catch (e) {
        return new Error('Invalid token');
      }
    } catch (e) {
      return new Error('Internal error');
    }
  });

server.register(fastifyAuth);

server.register(identityController, { prefix: '/identity/api/v1' });
server.register(profileController, { prefix: '/profile/api/v1' });

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

    server.listen({ host: server.envConfig.HOST, port: server.envConfig.PORT }, (err) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    });
  });
