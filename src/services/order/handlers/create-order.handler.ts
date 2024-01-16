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
  comment: string;
  price: number;
  transportId: string;
  timeStart: string;
  startFreeSeatCount: number;
}

export const createOrderHandler = async (fastify: FastifyInstance, data: OrderData): Promise<string> => {
  const ordersTable = fastify.cdb.table<OrdersTable>(TableName.orders);
  const routesTable = fastify.cdb.table<RoutesTable>(TableName.routes);

  const routeId = randomUUID();

  try {
    const insertValue: RoutesTable = {
      id: routeId,
      from: data.route.from,
      to: data.route.to,
    };
    await routesTable.insert(insertValue);
  } catch (e) {
    fastify.log.error(e);
    throw new Error('Ошибка при создании маршрута');
  }

  const orderId = randomUUID();

  let timeStartToIso: string = '';
  try {
    timeStartToIso = new Date(data.timeStart).toISOString();
  } catch (e) {
    throw new Error('Не смогли конвертировать дату к ISO');
  }

  try {
    const insertValue: OrdersTable = {
      id: orderId,
      driverPid: data.driverProfileId,
      routeId,
      comment: data.comment,
      price: data.price,
      transportId: data.transportId,
      timeStart: timeStartToIso,
      startFreeSeatCount: data.startFreeSeatCount,
      isDeclined: false,
    };
    await ordersTable.insert(insertValue);
  } catch (e) {
    fastify.log.error(e);
    throw new Error('Ошибка при создании заявки');
  }

  return orderId;
};
