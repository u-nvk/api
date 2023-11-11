import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { ProfilesTable } from '../db';

export const setDriverStatusHandler = async (fastify: FastifyInstance, userId: string, status: boolean): Promise<boolean> => {
  const profilesTable = fastify.cdb.table<ProfilesTable>(TableName.profiles);

  await profilesTable.where('userId', userId).update('isDriver', status);

  return true;
};
