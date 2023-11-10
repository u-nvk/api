import {
  FastifyInstance, FastifyPluginAsync, FastifyRequest,
} from 'fastify';
import {
  PostExchangeAccessVkTokenRequestDto,
  PostExchangeAccessVkTokenRequestDtoSchema,
  PostExchangeVkTokenRequestDto,
  PostExchangeVkTokenRequestDtoSchema,
} from './dto';
import { exchangeVkTokenHandler } from './handlers/exchange-vk-token.handler';
import { approveVkIdAndVkAccessTokenRelation } from './handlers/approve-vk-id-and-vk-access-token.relation';
import { insertOrUpdateUsersAndProfiles } from './handlers/insert-or-update-user.handler';

export const identityController: FastifyPluginAsync = async (server: FastifyInstance): Promise<void> => {
  server.post('/exchange-vk-token', {
    schema: {
      body: PostExchangeVkTokenRequestDtoSchema,
      tags: ['Identity'],
    },
  }, async (request: FastifyRequest<{ Body: PostExchangeVkTokenRequestDto }>, reply) => {
    try {
      const accessToken = await exchangeVkTokenHandler(server, request.body.vkToken, request.body.vkUuid, request.body.firstname, request.body.lastname);
      reply.status(200).send({ accessToken });
    } catch (e) {
      request.log.error(e);
      reply.status(500).send();
    }
  });

  server.post('/exchange-vk-access-token', {
    schema: {
      body: PostExchangeAccessVkTokenRequestDtoSchema,
      tags: ['Identity'],
    },
  }, async (request: FastifyRequest<{ Body: PostExchangeAccessVkTokenRequestDto }>, reply) => {
    try {
      const approveResult = await approveVkIdAndVkAccessTokenRelation(server, request.body.vkId, request.body.vkAccessToken);
      if (!approveResult.isApproved) {
        reply.status(400).send({ description: 'Идентификатор пользователя ВК не совпадает с переданным access token' });
        return;
      }

      const accessToken = await insertOrUpdateUsersAndProfiles(server, request.body.vkId, request.body.vkAccessToken, approveResult.userFirstname, approveResult.userLastname);

      reply.status(200).send({ accessToken });
    } catch (e) {
      reply.status(500).send({ description: 'Внутренняя ошибка' });
    }
  });
};
