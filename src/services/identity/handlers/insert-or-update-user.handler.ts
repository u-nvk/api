import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { TableName } from '@libs/tables';
import { JwtCreator } from '@libs/jwt';
import { DecodedJwtToken } from '@libs/common';
import { ProfilesTable } from '../../profile/db';
import { UsersTable } from '../db/users.table';

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
  let profileId: string | undefined;
  try {
    await fastify.cdb.transaction(async (trx) => {
      const usersTable = trx.table<UsersTable>(TableName.users);
      const profilesTable = trx.table<ProfilesTable>(TableName.profiles);

      const existedData: UsersTable | undefined = await usersTable.where('vkId', vkId).first();
      const isExist = !!existedData;

      userId = existedData?.id ?? randomUUID();

      if (isExist) {
        await usersTable.update({ vkAccessToken }).where('vkId', vkId);
        const profileData: ProfilesTable | undefined = await profilesTable.where('userId', userId).first();
        if (!profileData) {
          fastify.log.error('Пользователь уже зарегистрирован, но не имеет профиля');
          throw new Error('Not found profile');
        } else {
          profileId = profileData.id;
        }
      } else {
        const userInsert: UsersTable = {
          vkAccessToken,
          vkId,
          id: userId,
        };
        await usersTable.insert(userInsert);

        profileId = randomUUID();

        const profileInsert: ProfilesTable = {
          id: profileId,
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

  if (!profileId) {
    throw new Error('profileId does not filled');
  }

  const jwt = new JwtCreator<DecodedJwtToken>({ vkId, sub: userId, pId: profileId }, fastify.envConfig.ACCESS_SECRET).withExpiresIn(fastify.envConfig.ACCESS_TOKEN_EXPIRES);
  return jwt.create();
};
