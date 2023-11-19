import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify';
import {
  StdAuthHeadersSchema,
  StdErrorResponseSchema,
  StdOnlyIdResponseDto,
  StdOnlyIdResponseSchema,
} from '@libs/http';
import * as repl from 'repl';
import { createOrderHandler } from './handlers/create-order.handler';
import {
  GetOrderRequestUrlParam,
  GetOrderRequestUrlParamSchema, GetOrderResponseDto, GetOrderResponseDtoSchema,
  PostCreateOrderRequestDto,
  PostCreateOrderRequestDtoSchema,
} from './dto';
import { getOrderHandler } from './handlers/get-order.handler';
import { getOrdersHandler } from './handlers/get-orders.handler';

export const orderController: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post<{ Body: PostCreateOrderRequestDto, Reply: StdOnlyIdResponseDto }>('/', {
    schema: {
      description: 'Создание поездки',
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

      const orderId = await createOrderHandler(server, {
        driverProfileId: userId,
        route: request.body.route,
        price: request.body.price,
        transportId: request.body.transportId,
        timeStart: request.body.timeStart,
        startFreeSeatCount: request.body.startFreeSeatCount,
      });

      reply.status(200).send({ id: orderId });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.get<{ Reply: GetOrderResponseDto, Params: GetOrderRequestUrlParam }>('/:orderId', {
    schema: {
      description: 'Получение заявки',
      tags: ['Order'],
      params: GetOrderRequestUrlParamSchema,
      headers: StdAuthHeadersSchema,
      response: {
        200: GetOrderResponseDtoSchema,
      },
    },
  }, async (request: FastifyRequest<{ Params: GetOrderRequestUrlParam }>, reply) => {
    try {
      const data = await getOrderHandler(server, request.params.orderId);

      reply.status(200).send(data);
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });

  server.get('/', {

  }, async (request, reply) => {
    try {
      const data = await getOrdersHandler(server);

      reply.status(200).send({ orders: data });
    } catch (e) {
      request.log.error(e);
      reply.status(500);
    }
  });
};
