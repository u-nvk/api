import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { ParticipantsTable } from '../db';

export const unjoinToOrderHandler = async (fastify: FastifyInstance, orderId: string, userId: string): Promise<true> => {
  const participantsTable = fastify.cdb.table<ParticipantsTable>(TableName.participants);

  await participantsTable.where({ orderId, userPid: userId }).delete();

  return true;
};
