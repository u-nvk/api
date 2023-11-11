import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { UsersTable } from '../db/users.table';
import { TableName } from '../../../libs/tables';
import { ProfilesTable } from '../../profile/db';
import { JwtCreator } from '../../../libs/jwt';
import { DecodedJwtToken } from '../../../libs/common';

/**
 * Вставка/обновление данных пользователя в таблице пользователей и профилей
 * Перед вызовом данного метода нужно убедиться, что переданный vkAccessToken принадлежит переданному vkId
 * @see approveVkIdAndVkAccessTokenRelation
 * @param {FastifyInstance} fastify
 * @param {number} vkId - идентификатор пользователя в ВК
 * @param {string} vkAccessToken - аксес токен пользователя в ВК
 * @param {string} firstname - имя пользователя
 * @param {string} lastname - фамилия пользователя
 *
 */
export const insertOrUpdateUsersAndProfiles = async (fastify: FastifyInstance, vkId: number, vkAccessToken: string, firstname: string, lastname: string): Promise<string> => {
  let userId: string | undefined;
  try {
    await fastify.cdb.transaction(async (trx) => {
      const tableKnex = trx.table<UsersTable>(TableName.users);
      const profilesTable = trx.table<ProfilesTable>(TableName.profiles);

      const existedData: UsersTable | undefined = await tableKnex.where('vkId', vkId).first();
      const isExist = !!existedData;

      userId = existedData?.id ?? randomUUID();

      if (isExist) {
        await tableKnex.update({ vkAccessToken }).where('vkId', vkId);
      } else {
        const userInsert: UsersTable = {
          vkAccessToken,
          vkId,
          id: userId,
        };
        await tableKnex.insert(userInsert);

        const profileInsert: ProfilesTable = {
          id: randomUUID(),
          userId,
          surname: lastname,
          firstname,
          isDriver: false,
        };
        await profilesTable.insert(profileInsert);
      }
    });
  } catch (e) {
    fastify.log.error(e);
    throw new Error('Error with db, exchange vk token');
  }

  if (!userId) {
    throw new Error('userId does not filled');
  }

  const jwt = new JwtCreator<DecodedJwtToken>({ vkId, sub: userId }, fastify.envConfig.ACCESS_SECRET).withExpiresIn('90d');
  return jwt.create();
};
