import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { ProfilesTable } from '../db';

export const setDriverStatusHandler = async (fastify: FastifyInstance, profileId: string, status: boolean): Promise<boolean> => {
  const profilesTable = fastify.cdb.table<ProfilesTable>(TableName.profiles);

  await profilesTable.where('id', profileId).update('isDriver', status);

  return true;
};
