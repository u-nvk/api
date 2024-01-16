import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { OrdersTable, ParticipantsTable, RoutesTable } from '../db';

export interface GetOrdersHistoryHandlerResult {
  id: string;
  orderId: string;
  userPid: string;
  driverPid: string;
  price: number;
  timeStart: string;
  route: {
    from: string;
    to: string;
  };
  isDeclined: boolean;
}

export const getOrdersHistoryByDriverHandler = async (fastify: FastifyInstance, driverPid: string): Promise<GetOrdersHistoryHandlerResult[]> => {
  const result = await fastify.cdb.transaction(async (trx) => {
    const ordersTable = trx.table<OrdersTable>(TableName.orders);

    const res: (OrdersTable & RoutesTable & ParticipantsTable & { oId: string })[] = await ordersTable.select('*', `${TableName.orders}.id as oId`).where('driverPid', driverPid).where('timeStart', '<', new Date().toISOString())
      .leftJoin(TableName.routes, 'routeId', `${TableName.routes}.id`)
      .leftJoin(TableName.participants, 'orderId', `${TableName.orders}.id`)
      .orderBy('timeStart', 'asc');

    return res;
  });

  return result.map((item) => ({
    id: item.oId,
    orderId: item.oId,
    userPid: item.oId,
    driverPid: item.driverPid,
    price: item.price,
    timeStart: item.timeStart,
    route: {
      from: item.from,
      to: item.to,
    },
    isDeclined: item.isDeclined,
  }));
};
