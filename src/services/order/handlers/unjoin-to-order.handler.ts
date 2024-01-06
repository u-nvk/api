import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { OrdersTable, ParticipantsTable } from '../db';

export const unjoinToOrderHandler = async (fastify: FastifyInstance, orderId: string, userId: string): Promise<true> => {
  const participantsTable = fastify.cdb.table<ParticipantsTable>(TableName.participants);
  const ordersTable = fastify.cdb.table<OrdersTable>(TableName.orders);

  const orderData: { startFreeSeatCount: number, driverPid: string, timeStart: string } | undefined = await ordersTable.select(['startFreeSeatCount', 'driverPid', 'timeStart']).where('id', orderId).first();

  if (!orderData) {
    throw new Error('Not found order');
  }

  if (new Date(orderData.timeStart).getTime() < new Date().getTime()) {
    throw new Error('Can not unjoin to a past order');
  }

  await participantsTable.where({ orderId, userPid: userId }).delete();

  return true;
};
