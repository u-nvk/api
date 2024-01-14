import { FastifyInstance } from 'fastify';
import { TableName } from '@libs/tables';
import { OrdersTable, ParticipantsTable, RoutesTable } from '../db';
import { ProfilesTable, TransportsTable } from '../../profile/db';
import { UsersTable } from '../../identity/db/users.table';

// TODO: драйвера смапить

interface Order {
  id: string;
  driverPid: string;
  price: number;
  comment: string;
  route: {
    from: string;
    to: string;
  },
  transport: {
    plateNumber: string;
    color: string;
    name: string;
  },
  driver: {
    firstname: string;
    surname: string;
    vkId: number;
  },
  participants: {
    firstname: string;
    surname: string;
    vkId: number;
    pId: string;
  }[],
  timeStart: string;
  leftCount: number;
}

export const getOrderHandler = async (fastify: FastifyInstance, orderId: string): Promise<Order> => {
  const ordersTable = fastify.cdb.table<OrdersTable>(TableName.orders);
  const profilesTable = fastify.cdb.table<ProfilesTable>(TableName.profiles);
  const participantsTable = fastify.cdb.table<ParticipantsTable>(TableName.participants);

  const orderData: OrdersTable & Omit<RoutesTable, 'id'> & Omit<TransportsTable, 'id'> = await ordersTable
    .select([
      `${TableName.routes}.*`,
      `${TableName.profiles}.*`,
      `${TableName.transports}.*`,
      `${TableName.orders}.*`,
      `${TableName.transports}.id as tId`,
    ])
    .where(`${TableName.orders}.id`, orderId)
    .leftJoin(TableName.routes, `${TableName.orders}.routeId`, `${TableName.routes}.id`)
    .leftJoin(TableName.profiles, `${TableName.orders}.driverPid`, `${TableName.profiles}.id`)
    .leftJoin(TableName.transports, `${TableName.orders}.transportId`, `${TableName.transports}.id`)
    .first();

  const participantsIds: string[] = (await participantsTable.where('orderId', orderId)).map((p: ParticipantsTable) => p.userPid);

  const profilesData: (ProfilesTable & Pick<UsersTable, 'vkId'>)[] = await profilesTable
    .select([
      `${TableName.users}.vkId`,
      `${TableName.profiles}.*`,
    ])
    .whereIn(`${TableName.profiles}.id`, [orderData.driverPid, ...participantsIds])
    .leftJoin(TableName.users, `${TableName.profiles}.userId`, `${TableName.users}.id`);

  const driver = profilesData.find((item) => item.id === orderData.driverPid);
  const participants = profilesData.filter((item) => item.id !== orderData.driverPid);

  if (!driver) {
    throw new Error('Driver not exist');
  }

  return {
    id: orderData.id,
    driverPid: orderData.driverPid,
    price: orderData.price,
    comment: orderData.comment,
    route: {
      from: orderData.from,
      to: orderData.to,
    },
    transport: {
      plateNumber: orderData.plateNumber,
      color: orderData.color,
      name: orderData.name,
    },
    participants: participants.map((item) => ({
      firstname: item.firstname,
      surname: item.surname,
      vkId: item.vkId,
      pId: item.id,
    })),
    driver: {
      firstname: driver.firstname,
      surname: driver.surname,
      vkId: driver.vkId,
    },
    timeStart: orderData.timeStart,
    leftCount: orderData.startFreeSeatCount - participants.length,
  };
};
