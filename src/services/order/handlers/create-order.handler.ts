import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { randomUUID } from 'crypto';
import { OrdersTable, RoutesTable } from '../db';

export type NVK = 'NVK';

export type RouteFromNvk = {
  from: NVK,
  to: string,
}

export type RouteToNvk = {
  from: string,
  to: NVK,
}

interface OrderData {
  driverProfileId: string;
  route: RouteFromNvk | RouteToNvk;
  price: number;
  transportId: string;
  timeStart: string;
}

export const createOrderHandler = async (fastify: FastifyInstance, data: OrderData) => {
  const ordersTable = fastify.cdb.table<OrdersTable>(TableName.orders);
  const routesTable = fastify.cdb.table<RoutesTable>(TableName.routes);

  const routeId = randomUUID();

  try {
    await routesTable.insert({ id: routeId, from: data.route.from, to: data.route.to });
  } catch (e) {
    fastify.log.error(e);
    throw new Error('Ошибка при создании маршрута');
  }

  const orderId = randomUUID();

  try {
    await ordersTable.insert({
      id: orderId,
      driverId: data.driverProfileId,
      routeId,
      price: data.price,
      transportId: data.transportId,
      timeStart: data.timeStart,
    });
  } catch (e) {
    fastify.log.error('');
  }

  return orderId;
};
