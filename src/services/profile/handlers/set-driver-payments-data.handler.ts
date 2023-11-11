import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { TableName } from '@libs/tables';
import { PaymentMethodsTable } from '../db';

export enum BankNumber {
  sberbank = 0,
  tinkoff,
  alfa,
  vtb,
}

export const setDriverPaymentsDataHandler = async (fastiy: FastifyInstance, userId: string, payments: { phone: string, bank: BankNumber }[]): Promise<boolean> => {
  const paymentTable = fastiy.cdb.table<PaymentMethodsTable>(TableName.paymentMethods);

  const objectsToInsert: PaymentMethodsTable[] = payments.map((item) => ({
    id: randomUUID(),
    ownerId: userId,
    phone: item.phone,
    bank: item.bank,
  }));

  try {
    await paymentTable.insert(objectsToInsert);
    return true;
  } catch (e) {
    throw new Error('Error while insert data, setDriverData', { cause: e });
  }
};
