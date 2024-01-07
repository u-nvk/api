import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { TransportsTable } from '../db';

export const markTransportAsUnactiveHandler = async (fastiy: FastifyInstance, transportId: string, initiatorPid: string): Promise<boolean> => {
  const transportTable = fastiy.cdb.table<TransportsTable>(TableName.transports);

  const targetTransport: TransportsTable | undefined = await transportTable.where('id', transportId).first();

  if (!targetTransport) {
    throw new Error(`${transportId} not exist`);
  }

  if (targetTransport.ownerPid !== initiatorPid) {
    throw new Error('Not owner');
  }

  await transportTable.where('id', transportId).update('isActive', false);

  return true;
};
