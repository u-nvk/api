import {FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyRequest} from "fastify";
import {PostExchangeVkTokenRequestDto, PostExchangeVkTokenRequestDtoSchema} from "./dto";
import {exchangeVkTokenHandler} from "./handlers/exchange-vk-token.handler";

export const identityController: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
  server.post('/exchange-vk-token', {
    schema: {
      body: PostExchangeVkTokenRequestDtoSchema,
    }
  }, async (request: FastifyRequest<{ Body: PostExchangeVkTokenRequestDto }>, reply) => {
    try {
      const accessToken = await exchangeVkTokenHandler(server, request.body.vkToken, request.body.vkUuid)
      reply.status(200).send({ accessToken });
    } catch (e) {
      request.log.error(e);
      reply.status(500).send();
    }
  })

}
