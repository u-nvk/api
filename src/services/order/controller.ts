import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify';

export const orderController: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post('/', {
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest, reply) => {
    const userId: string | undefined = request.requestContext.get('decodedJwt')?.sub;

    if (!userId) {
      throw new Error('Not access token');
    }
  });
};
