import {FastifyInstance, FastifyPluginAsync, FastifyRequest} from "fastify";
import {
  PostDataHeadersSchema,
  PostProfileDataRequestDto,
  PostDataRequestDtoSchema,
  GetProfileDataResponseDtoSchema,
} from "./dto";
import {setDriverDataHandler, getProfileDataHandler} from "./handlers";

export const profileController: FastifyPluginAsync = async (server: FastifyInstance) => {

  server.get('/data', {
    schema: {
      tags: ['Profile'],
      response: {
        200: GetProfileDataResponseDtoSchema
      },
      headers: PostDataHeadersSchema,
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest, reply) => {
    const userId: string | undefined = request.requestContext.get('decodedJwt')?.sub;

    if (!userId) {
      throw new Error('Not access token');
    }

    const data = await getProfileDataHandler(server, userId);
    reply.status(200).send(data);
  });

  server.post<{ Body: PostProfileDataRequestDto }>('/data', {
      schema: {
        body: PostDataRequestDtoSchema,
        tags: ['Profile'],
      },
      preHandler: server.auth([server.verifyJwtIdentity]),
    },
    async (request: FastifyRequest<{ Body: PostProfileDataRequestDto }>, reply) => {
      const userId = request.requestContext.get('decodedJwt');

      if (!userId) {
        throw new Error('Not access token');
      }

      const paymentMethod = request.body.paymentMethods[0];
      await setDriverDataHandler(server, userId.sub, paymentMethod.phone, paymentMethod.bank);
      reply.status(200)
    }
  )

}
