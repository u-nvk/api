import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { TransportsTable } from '../db';

export const getDriverTransportsHandler = async (fastify: FastifyInstance, profileId: string): Promise<TransportsTable[]> => {
  const transportTable = fastify.cdb.table<TransportsTable>(TableName.transports);

  return transportTable.where('ownerPid', profileId).where('isActive', true);
};
