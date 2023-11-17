import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { randomUUID } from 'crypto';
import { TransportsTable } from '../db';

export interface DriverTransport {
  name: string;
  color: string;
  plate: string;
}

export const setDriverTransportHandler = async (fastify: FastifyInstance, transportData: DriverTransport, profileId: string): Promise<true> => {
  const transportTable = fastify.cdb.table<TransportsTable>(TableName.transports);

  const insertData: TransportsTable = {
    color: transportData.color,
    id: randomUUID(),
    name: transportData.name,
    plateNumber: transportData.plate,
    ownerId: profileId,
  };

  await transportTable.insert(insertData);

  return true;
};
