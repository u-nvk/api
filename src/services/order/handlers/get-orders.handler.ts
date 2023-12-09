import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { OrdersTable, ParticipantsTable, RoutesTable } from '../db';

interface OrderPreview {
  id: string;
  driverPid: string;
  price: number;
  route: {
    from: string;
    to: string;
  },
  participantIds: string[],
  leftCount: number;
  timeStart: string;
}

export const getOrdersHandler = async (fastify: FastifyInstance): Promise<OrderPreview[]> => {
  const ordersTable = fastify.cdb.table<OrdersTable>(TableName.orders);
  const participantTable = fastify.cdb.table<ParticipantsTable>(TableName.participants);

  const result: (OrdersTable & RoutesTable)[] = await ordersTable
    .select([
      `${TableName.routes}.*`,
      `${TableName.orders}.*`,
      `${TableName.routes}.id as rId`,
    ])
    .where('timeStart', '>=', (new Date()).toISOString())
    .leftJoin(`${TableName.routes}`, `${TableName.orders}.routeId`, `${TableName.routes}.id`);

  const parts: ParticipantsTable[] = await participantTable.whereIn('orderId', result.map((i) => i.id));

  return result
    .map((item) => {
      const takenCount = parts.reduce((prev, curr) => {
        if (curr.orderId === item.id) {
          return prev + 1;
        }

        return prev;
      }, 0);

      const participantIds: string[] = parts.filter((participant) => participant.orderId === item.id).map((participant) => participant.userPid);

      return {
        id: item.id,
        driverPid: item.driverPid,
        price: item.price,
        leftCount: item.startFreeSeatCount - takenCount,
        route: {
          from: item.from,
          to: item.to,
        },
        participantIds,
        timeStart: item.timeStart,
      };
    })
    .sort((a, b) => new Date(b.timeStart).valueOf() - new Date(a.timeStart).valueOf());
};
