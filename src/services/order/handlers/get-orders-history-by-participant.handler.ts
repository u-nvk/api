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

export const getOrdersHistoryByParticipantHandler = async (fastify: FastifyInstance, currentUserPid: string): Promise<GetOrdersHistoryHandlerResult[]> => {
  const result = await fastify.cdb.transaction(async (trx) => {
    const participantTable = trx.table<ParticipantsTable>(TableName.participants);

    const allOrderWhereUserBe: (OrdersTable & RoutesTable & ParticipantsTable)[] = await participantTable.select('*').where('userPid', currentUserPid)
      .leftJoin(TableName.orders, 'orderId', `${TableName.orders}.id`)
      .where(`${TableName.orders}.timeStart`, '<', new Date().toISOString())
      .leftJoin(TableName.routes, 'routeId', `${TableName.routes}.id`)
      .orderBy('timeStart', 'asc');

    return allOrderWhereUserBe;
  });

  return result.map((item) => ({
    id: item.id,
    orderId: item.orderId,
    userPid: item.userPid,
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
