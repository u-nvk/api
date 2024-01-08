import {
  FastifyInstance, FastifyPluginAsync, FastifyRequest,
} from 'fastify';
import {
  StdAuthHeadersSchema,
  StdErrorResponseSchema, StdOnlyAuthHeadersSchema,
  StdOnlyIdResponseDto,
  StdOnlyIdResponseSchema,
} from '@libs/http';
import {
  PostProfileDataRequestDto,
  PostDataRequestDtoSchema,
  GetProfileDataResponseDtoSchema,
  GetProfileDataResponseDto,
  PostCreateTransportRequestDto,
  PostCreateTransportRequestDtoSchema,
  GetTransportsResponseDtoSchema,
  GetTransportsResponseDto,
  MarkTransportAsUnactiveUrlParamSchema, MarkTransportAsUnactiveUrlParam,
} from './dto';
import { setDriverPaymentsDataHandler, getProfileDataHandler, GetProfileDataHandlerReturn } from './handlers';
import { setDriverStatusHandler } from './handlers/set-driver-status.handler';
import { setDriverTransportHandler } from './handlers/set-driver-transport.handler';
import { getDriverTransportsHandler } from './handlers/get-driver-transports.handler';
import {
  GetDataByUseridResponseDto,
  GetDataByUseridResponseDtoSchema,
} from './dto/get-data-by-userid/get-data-by-userid-response.dto';
import {
  GetDataByUseridRequestUrlParam,
  GetDataByUseridRequestUrlParamSchema,
} from './dto/get-data-by-userid/get-data-by-userid-request.dto';
import { markTransportAsUnactiveHandler } from './handlers/mark-transport-as-unactive.handler';

export const profileController: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get<{ Reply: GetProfileDataResponseDto }>('/data/user', {
    schema: {
      description: 'Получение данных о пользователе',
      tags: ['Profile'],
      response: {
        200: GetProfileDataResponseDtoSchema,
      },
      headers: StdAuthHeadersSchema,
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest, reply) => {
    const userId: string | undefined = request.requestContext.get('decodedJwt')?.pId;

    if (!userId) {
      throw new Error('Not access token');
    }

    const data: GetProfileDataHandlerReturn = await getProfileDataHandler(server, userId);
    reply.status(200).send(data);
  });

  server.get<{ Reply: GetDataByUseridResponseDto, Params: GetDataByUseridRequestUrlParam }>('/data/user/:userPid', {
    schema: {
      description: 'Получение данных о пользователе по айди',
      tags: ['Profile'],
      params: GetDataByUseridRequestUrlParamSchema,
      response: {
        200: GetDataByUseridResponseDtoSchema,
      },
      headers: StdAuthHeadersSchema,
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest<{ Params: GetDataByUseridRequestUrlParam }>, reply) => {
    try {
      const result = await getProfileDataHandler(server, request.params.userPid);
      const onlyNeedData: GetDataByUseridResponseDto = {
        payments: result.payments,
      };

      reply.status(200).send(onlyNeedData);
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.post<{ Body: PostProfileDataRequestDto }>(
    '/data/user',
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
        await setDriverPaymentsDataHandler(server, userId.pId, request.body.paymentMethods);
      }

      if (typeof request.body.isDriver === 'boolean') {
        await setDriverStatusHandler(server, userId.pId, request.body.isDriver);
      }

      reply.status(200);
    },
  );

  server.post<{ Body: PostCreateTransportRequestDto }>('/data/transports', {
    schema: {
      description: 'Привязка транспорта к профилю водителя',
      body: PostCreateTransportRequestDtoSchema,
      headers: StdAuthHeadersSchema,
      tags: ['Profile'],
      response: {
        200: StdOnlyIdResponseSchema,
        500: StdErrorResponseSchema,
      },
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest<{ Body: PostCreateTransportRequestDto }>, reply) => {
    const userId = request.requestContext.get('decodedJwt');

    if (!userId) {
      throw new Error('Not access token');
    }

    try {
      const id = await setDriverTransportHandler(server, {
        name: request.body.name,
        color: request.body.color,
        plate: request.body.plateNumber,
      }, userId.pId);

      reply.status(200).send({ id });
    } catch (e) {
      request.log.error(e);
      reply.status(500).send({ description: 'Внутренняя ошибка' });
    }
  });

  server.delete<{ Reply: StdOnlyIdResponseDto, Params: MarkTransportAsUnactiveUrlParam }>('/data/transports/:id', {
    schema: {
      description: 'Пометка транспорта как удаленного',
      tags: ['Profile'],
      params: MarkTransportAsUnactiveUrlParamSchema,
      response: {
        200: StdOnlyIdResponseSchema,
      },
      headers: StdOnlyAuthHeadersSchema,
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request, reply) => {
    try {
      const user = request.requestContext.get('decodedJwt');

      if (!user) {
        throw new Error('Not access token');
      }

      await markTransportAsUnactiveHandler(server, request.params.id, user.pId);

      reply.status(200).send({ id: request.params.id });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.get<{ Reply: GetTransportsResponseDto }>('/data/transports', {
    schema: {
      description: 'Получение транспортов, привязанных к пользователю',
      headers: StdAuthHeadersSchema,
      tags: ['Profile'],
      response: {
        200: GetTransportsResponseDtoSchema,
        500: StdErrorResponseSchema,
      },
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest, reply) => {
    const userId = request.requestContext.get('decodedJwt');

    if (!userId) {
      throw new Error('Not access token');
    }

    const result = await getDriverTransportsHandler(server, userId.pId);

    await reply.status(200).send({
      transports: result ?? [],
    });
  });
};
