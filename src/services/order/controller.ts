import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify';
import {
  StdAuthHeadersSchema,
  StdErrorResponseSchema, StdOnlyAuthHeadersSchema,
  StdOnlyIdResponseDto,
  StdOnlyIdResponseSchema,
} from '@libs/http';
import { createOrderHandler } from './handlers/create-order.handler';
import {
  DeleteOrderRequestUrlParam, DeleteUnjoinToOrderRequestUrlParam,
  GetOrderHistoryResponseDto, GetOrderHistoryResponseDtoSchema,
  GetOrderRequestUrlParam,
  GetOrderRequestUrlParamSchema,
  GetOrderResponseDto,
  GetOrderResponseDtoSchema,
  PostCreateOrderRequestDto,
  PostCreateOrderRequestDtoSchema,
} from './dto';
import { getOrderHandler } from './handlers/get-order.handler';
import { getOrdersHandler } from './handlers/get-orders.handler';
import { GetOrdersResponseDto, GetOrdersResponseDtoSchema } from './dto/get-orders/get-orders-response.dto';
import { joinToOrderHandler } from './handlers/join-to-order.handler';
import {
  getOrdersHistoryByParticipantHandler,
  GetOrdersHistoryHandlerResult,
} from './handlers/get-orders-history-by-participant.handler';
import { deleteOrderHandler } from './handlers/delete-order.handler';
import { unjoinToOrderHandler } from './handlers/unjoin-to-order.handler';
import {
  GetOrderHistoryRequestQuery,
  GetOrderHistoryRequestQuerySchema,
} from './dto/get-order-history/get-order-history-request.dto';
import { getOrdersHistoryByDriverHandler } from './handlers/get-orders-history-by-driver.handler';
import { declineOrderHandler } from './handlers/decline-order.handler';

export const orderController: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.get<{ Reply: GetOrderResponseDto, Params: GetOrderRequestUrlParam }>('/order/:orderId', {
    schema: {
      summary: 'Получение заявки',
      description: 'Получение заявки по orderId',
      tags: ['Order'],
      params: GetOrderRequestUrlParamSchema,
      headers: StdAuthHeadersSchema,
      response: {
        200: GetOrderResponseDtoSchema,
      },
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest<{ Params: GetOrderRequestUrlParam }>, reply) => {
    try {
      const data = await getOrderHandler(server, request.params.orderId);

      reply.status(200).send(data);
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.get<{ Reply: GetOrdersResponseDto }>('/order', {
    schema: {
      summary: 'Получение всех заявок на поездку',
      description: 'Вернутся только те заявки, timeStart которых больше текущего времени',
      tags: ['Order'],
      headers: StdAuthHeadersSchema,
      response: {
        200: GetOrdersResponseDtoSchema,
        500: StdErrorResponseSchema,
      },
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request, reply) => {
    try {
      const data = await getOrdersHandler(server);

      reply.status(200).send({ orders: data });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.get<{ Reply: GetOrderHistoryResponseDto, Querystring: GetOrderHistoryRequestQuery }>('/order/history', {
    schema: {
      description: 'Получить историю поездок пользователя',
      tags: ['Order'],
      headers: StdAuthHeadersSchema,
      response: {
        200: GetOrderHistoryResponseDtoSchema,
        500: StdErrorResponseSchema,
      },
      querystring: GetOrderHistoryRequestQuerySchema,
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request, reply) => {
    try {
      const userId: string | undefined = request.requestContext.get('decodedJwt')?.pId;

      if (!userId) {
        throw new Error('Not access token');
      }

      let result: GetOrdersHistoryHandlerResult[] = [];

      if (request.query.role === 'driver') {
        result = await getOrdersHistoryByDriverHandler(server, userId);
      } else {
        result = await getOrdersHistoryByParticipantHandler(server, userId);
      }

      return {
        list: result,
      };
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.post<{ Body: PostCreateOrderRequestDto, Reply: StdOnlyIdResponseDto }>('/order', {
    schema: {
      summary: 'Создание поездки',
      tags: ['Order'],
      response: {
        200: StdOnlyIdResponseSchema,
        500: StdErrorResponseSchema,
      },
      headers: StdAuthHeadersSchema,
      body: PostCreateOrderRequestDtoSchema,
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest<{ Body: PostCreateOrderRequestDto }>, reply) => {
    try {
      const userId: string | undefined = request.requestContext.get('decodedJwt')?.pId;

      if (!userId) {
        throw new Error('Not access token');
      }

      if (new Date(request.body.timeStart).getTime() - new Date().getTime() <= 0) {
        throw new Error('Can not create order with passed time');
      }

      const orderId = await createOrderHandler(server, {
        driverProfileId: userId,
        route: request.body.route,
        price: request.body.price,
        transportId: request.body.transportId,
        timeStart: request.body.timeStart,
        startFreeSeatCount: request.body.startFreeSeatCount,
        comment: request.body.comment,
      });

      reply.status(200).send({ id: orderId });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.post<{ Params: GetOrderRequestUrlParam }>('/order/:orderId/participants', {
    schema: {
      params: GetOrderRequestUrlParamSchema,
      summary: 'Записаться на поездку',
      tags: ['Order'],
      headers: StdAuthHeadersSchema,
      response: {
        200: StdOnlyIdResponseSchema,
        500: StdErrorResponseSchema,
      },
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request, reply) => {
    try {
      const userId: string | undefined = request.requestContext.get('decodedJwt')?.pId;

      if (!userId) {
        throw new Error('Not access token');
      }

      const id = await joinToOrderHandler(server, request.params.orderId, userId);

      reply.status(200).send({ id });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.delete<{ Params: DeleteUnjoinToOrderRequestUrlParam }>('/order/:orderId/participants', {
    schema: {
      summary: 'Убрать свою запись на поездку',
      tags: ['Order'],
      headers: StdOnlyAuthHeadersSchema,
      response: {
        500: StdErrorResponseSchema,
      },
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest<{ Params: DeleteUnjoinToOrderRequestUrlParam }>, reply) => {
    try {
      const userId: string | undefined = request.requestContext.get('decodedJwt')?.pId;

      if (!userId) {
        throw new Error('Not access token');
      }

      await unjoinToOrderHandler(server, request.params.orderId, userId);

      reply.status(200).send({ orderId: request.params.orderId });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.put<{ Params: DeleteUnjoinToOrderRequestUrlParam }>('/order/:orderId/decline', {
    schema: {
      tags: ['Order'],
      summary: 'Отмена заявки о перевозке',
      headers: StdOnlyAuthHeadersSchema,
      params: GetOrderRequestUrlParamSchema,
      description: 'Отмена заявки о перевозке. Может выполнять только водитель создавший заявку',
      response: {
        500: StdErrorResponseSchema,
      },
    },
    preHandler: server.auth([server.verifyJwtIdentity]),
  }, async (request: FastifyRequest<{ Params: DeleteOrderRequestUrlParam }>, reply) => {
    try {
      const userId: string | undefined = request.requestContext.get('decodedJwt')?.pId;

      if (!userId) {
        throw new Error('Not access token');
      }

      const result = await declineOrderHandler(server, request.params.orderId, userId);

      reply.status(200).send({ isOk: true });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });
};
