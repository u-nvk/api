import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { ProfilesTable, PaymentMethodsTable } from '../db';

export interface GetProfileDataHandlerReturn {
  userId: string;
  surname: string;
  firstname: string;
  isDriver: boolean;
  payments: {
    phone: string;
    bank: number;
  }[];
}

export const getProfileDataHandler = async (fastiy: FastifyInstance, userId: string): Promise<GetProfileDataHandlerReturn> => {
  const profilesTable = fastiy.cdb.table<ProfilesTable>(TableName.profiles);
  const paymentsTable = fastiy.cdb.table<PaymentMethodsTable>(TableName.paymentMethods);

  const [profile, payments]: [ProfilesTable | undefined, PaymentMethodsTable[]] = await Promise.all(
    [
      profilesTable.where('userId', userId).first(),
      paymentsTable.where('ownerPid', userId),
    ],
  );

  if (!profile) {
    throw new Error('User does not exist');
  }

  return {
    userId: profile.userId,
    firstname: profile.firstname,
    surname: profile.surname,
    isDriver: profile.isDriver,
    payments: payments.map((item) => ({ phone: item.phone, bank: item.bank })),
  };
};
