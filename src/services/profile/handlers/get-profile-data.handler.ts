import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { ProfilesTable, PaymentMethodsTable } from '../db';

export interface GetProfileDataHandlerReturn {
  userId: string;
  userPid: string;
  surname: string;
  firstname: string;
  isDriver: boolean;
  payments: {
    phone: string;
    bank: number;
  }[];
}

export const getProfileDataHandler = async (fastiy: FastifyInstance, pId: string): Promise<GetProfileDataHandlerReturn> => {
  const profilesTable = fastiy.cdb.table<ProfilesTable>(TableName.profiles);
  const paymentsTable = fastiy.cdb.table<PaymentMethodsTable>(TableName.paymentMethods);

  const [profile, payments]: [ProfilesTable | undefined, PaymentMethodsTable[]] = await Promise.all(
    [
      profilesTable.where('id', pId).first(),
      paymentsTable.where('ownerPid', pId),
    ],
  );

  if (!profile) {
    throw new Error('User does not exist');
  }

  return {
    userId: profile.userId,
    userPid: profile.id,
    firstname: profile.firstname,
    surname: profile.surname,
    isDriver: profile.isDriver,
    payments: payments.map((item) => ({ phone: item.phone, bank: item.bank })),
  };
};
