import {
  FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest,
} from 'fastify';
import { StdAuthHeadersSchema } from '@libs/http';
import {
  PostProfileDataRequestDto,
  PostDataRequestDtoSchema,
  GetProfileDataResponseDtoSchema, GetProfileDataResponseDto,
} from './dto';
import { setDriverPaymentsDataHandler, getProfileDataHandler, GetProfileDataHandlerReturn } from './handlers';
import { setDriverStatusHandler } from './handlers/set-driver-status.handler';

export const profileController: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get<{ Reply: GetProfileDataResponseDto }>('/data', {
    schema: {
      description: 'Получение данных профиля',
      tags: ['Profile'],
      response: {
        200: GetProfileDataResponseDtoSchema,
      },
      headers: StdAuthHeadersSchema,
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest, reply) => {
    const userId: string | undefined = request.requestContext.get('decodedJwt')?.sub;

    if (!userId) {
      throw new Error('Not access token');
    }

    const data: GetProfileDataHandlerReturn = await getProfileDataHandler(server, userId);
    reply.status(200).send(data);
  });

  server.post<{ Body: PostProfileDataRequestDto }>(
    '/data',
    {
      schema: {
        description: 'Установка данных профиля. Данные переписываются, а не дополняются. Например, если массив был [1] и вы в данном ресте отправили [2], то в базе будет храниться [2]. Если нужно, чтобы было [1, 2], то так в body отправлять и надо',
        body: PostDataRequestDtoSchema,
        tags: ['Profile'],
        response: {
          200: {},
        },
        headers: StdAuthHeadersSchema,
      },
      preHandler: server.auth([server.verifyJwtIdentity]),
    },
    async (request: FastifyRequest<{ Body: PostProfileDataRequestDto }>, reply) => {
      const userId = request.requestContext.get('decodedJwt');

      if (!userId) {
        throw new Error('Not access token');
      }

      if (request.body.paymentMethods) {
        await setDriverPaymentsDataHandler(server, userId.sub, request.body.paymentMethods);
      }

      if (typeof request.body.isDriver === 'boolean') {
        await setDriverStatusHandler(server, userId.sub, request.body.isDriver);
      }

      reply.status(200);
    },
  );
};
