import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { randomUUID } from 'crypto';
import { OrdersTable, ParticipantsTable } from '../db';

export const joinToOrderHandler = async (fastify: FastifyInstance, orderId: string, userId: string): Promise<string> => {
  let insertValueId = null;

  await fastify.cdb.transaction(async (trx) => {
    const ordersTable = trx.table<OrdersTable>(TableName.orders);
    const participantTable = trx.table<ParticipantsTable>(TableName.participants);

    const orderData: { startFreeSeatCount: number, driverPid: string } = await ordersTable.select(['startFreeSeatCount', 'driverPid']).where('id', orderId).first();

    if (orderData.driverPid === userId) {
      throw new Error('Driver can not be participant');
    }

    const participants: ParticipantsTable[] = await participantTable.where('orderId', orderId);

    const participantsCount = participants.length;

    if (participantsCount >= orderData.startFreeSeatCount) {
      throw new Error('Not free seats');
    }

    if (participants.some((item) => item.userPid === userId)) {
      throw new Error('Already participant');
    }

    insertValueId = randomUUID();

    const insertValue: ParticipantsTable = {
      id: insertValueId,
      orderId,
      userPid: userId,
    };

    await participantTable.insert(insertValue);
  });

  if (!insertValueId) {
    throw new Error('');
  }

  return insertValueId;
};
