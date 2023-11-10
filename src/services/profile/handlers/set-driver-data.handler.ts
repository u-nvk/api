import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { TableName } from '../../../libs/tables';
import { PaymentMethodsTable } from '../db';

// eslint-disable-next-line no-shadow
export enum BankNumber {
  sberbank = 0,
  tinkoff,
  alfa,
  vtb,
}

export const setDriverDataHandler = async (fastiy: FastifyInstance, userId: string, phone: string, bank: BankNumber): Promise<boolean> => {
  const paymentTable = fastiy.cdb.table<PaymentMethodsTable>(TableName.paymentMethods);

  const objToInsert: PaymentMethodsTable = {
    id: randomUUID(),
    ownerId: userId,
    phone,
    bank,
  };

  try {
    await paymentTable.insert(objToInsert);
    return true;
  } catch (e) {
    throw new Error('Error while insert data, setDriverData', { cause: e });
  }
};
