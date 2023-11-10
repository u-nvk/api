import {FastifyInstance} from "fastify";
import {TableName} from "../../../libs/tables";
import {ProfilesTable} from "../db/profiles.table";
import {PaymentMethodsTable} from "../db/payment-methods.table";

export const getDataHandler = async (fastiy: FastifyInstance) => {
  const profilesTable = fastiy.cdb.table<ProfilesTable>(TableName.profiles)
  const paymentMethodsTable = fastiy.cdb.table<PaymentMethodsTable>(TableName.paymentMethods);

  profilesTable.where('')
}
