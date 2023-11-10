import {knex} from "knex";
import {FastifyInstance} from "fastify";
import {TableName} from "../../../libs/tables";
import {PaymentMethodsTable} from "../db/payment-methods.table";
import {randomUUID} from "crypto";

export enum BankNumber {
  sberbank = 0,
  tinkoff,
  alfa,
  vtb,
}

export const setDriverDataHandler = async (fastiy: FastifyInstance, userId: string, phone: string, bank: BankNumber) => {
  const paymentTable = fastiy.cdb.table<PaymentMethodsTable>(TableName.paymentMethods);

  const objToInsert: PaymentMethodsTable = {
    id: randomUUID(),
    ownerId: userId,
    phone: phone,
    bank: bank,
  }

  try {
    await paymentTable.insert(objToInsert);
    return true;
  } catch (e) {
    throw new Error('Error while insert data, setDriverData', { cause: e });
  }
}
