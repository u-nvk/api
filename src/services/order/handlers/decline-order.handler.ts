import { TableName } from '@libs/tables';
import { FastifyInstance } from 'fastify';
import { OrdersTable } from '../db';

export const declineOrderHandler = async (fastify: FastifyInstance, orderId: string, userPid: string): Promise<boolean> => {
  const result = await fastify.cdb.transaction(async (trx) => {
    const ordersTable = trx.table<OrdersTable>(TableName.orders);

    const order: Pick<OrdersTable, 'driverPid'> | undefined = await ordersTable.select('driverPid').where('id', orderId).first();

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    if (order.driverPid !== userPid) {
      throw new Error('User is not owner of this order');
    }

    await ordersTable.where('id', orderId).update('isDeclined', true);

    return true;
  });

  return result;
};
