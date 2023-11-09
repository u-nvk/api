import {FastifyInstance, FastifyPluginAsync, FastifyRequest} from "fastify";

export const profileController: FastifyPluginAsync = async (server: FastifyInstance) => {

  server.get('/data', {
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest, reply) => {
    reply.status(200).send(request.requestContext.get('decodedJwt'));
  })

}
