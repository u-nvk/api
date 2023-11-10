import {FastifyInstance, FastifyPluginAsync, FastifyRequest} from "fastify";
import {PostDataRequestDto, PostDataRequestDtoSchema} from "./dto/post-data/post-data-request.dto";
import {setDriverDataHandler} from "./handlers/set-driver-data.handler";

export const profileController: FastifyPluginAsync = async (server: FastifyInstance) => {

  server.get('/data', {
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest, reply) => {
    reply.status(200).send(request.requestContext.get('decodedJwt'));
  });

  server.post('/data', {
      schema: {
        body: PostDataRequestDtoSchema,
        tags: ['Profile'],
      }
    },
    async (request: FastifyRequest<{ Body: PostDataRequestDto }>, reply) => {
      const userId = request.requestContext.get('decodedJwt');

      if (!userId) {
        throw new Error('Not access token');
      }

      const paymentMethod = request.body.paymentMethods[0];
      await setDriverDataHandler(server, userId.sub, paymentMethod.phone, paymentMethod.bank);
    }
  )

}
