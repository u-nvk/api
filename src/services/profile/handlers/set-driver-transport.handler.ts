import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { randomUUID } from 'crypto';
import { TransportsTable } from '../db';

export interface DriverTransport {
  name: string;
  color: string;
  plate: string;
}

export const setDriverTransportHandler = async (fastify: FastifyInstance, transportData: DriverTransport, profileId: string): Promise<string> => {
  const transportTable = fastify.cdb.table<TransportsTable>(TableName.transports);

  const id = randomUUID();

  const insertData: TransportsTable = {
    color: transportData.color,
    id,
    name: transportData.name,
    plateNumber: transportData.plate,
    ownerPid: profileId,
    isActive: true,
  };

  await transportTable.insert(insertData);

  return id;
};
