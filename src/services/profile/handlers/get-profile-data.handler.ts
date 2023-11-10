import { FastifyInstance } from 'fastify';
import { TableName } from '../../../libs/tables';
import { ProfilesTable, PaymentMethodsTable } from '../db';
import { Nullable } from '../../../libs/common';

export const getProfileDataHandler = async (fastiy: FastifyInstance, userId: string): Promise<ProfilesTable & Nullable<Omit<PaymentMethodsTable, 'id'>>> => {
  const profilesTable = fastiy.cdb.table<ProfilesTable>(TableName.profiles);

  const result: ProfilesTable & Nullable<Omit<PaymentMethodsTable, 'id'>> = await profilesTable
    .where('userId', userId)
    .leftJoin(TableName.paymentMethods, `${TableName.profiles}.userId`, '=', `${TableName.paymentMethods}.ownerId`)
    .first();

  return result;
};
