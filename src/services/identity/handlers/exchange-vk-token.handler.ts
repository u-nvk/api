import {FastifyInstance} from "fastify";
import {UsersTable} from "../db/users.table";
import { v4 as uuidv4 } from 'uuid';
import {JwtCreator} from "../../../libs/jwt";
import {ProfilesTable} from "../../profile/db/profiles.table";

export const exchangeVkTokenHandler = async (fastify: FastifyInstance, vkTokenToExchange: string, vkUuid: string, firstname: string, lastname: string): Promise<string> => {
  const urlPath = `https://${fastify.envConfig.VK_API_DOMAIN}/${fastify.envConfig.VK_API_EXCHANGE_METHOD}`
  const body = {
    v: 5.131,
    token: vkTokenToExchange,
    access_token: fastify.envConfig.VK_SERVICE_TOKEN,
    uuid: vkUuid
  }
  const query = `v=${body.v}&token=${body.token}&access_token=${body.access_token}&uuid=${body.uuid}`;
  const req = await fetch(urlPath + `?${query}`);
  const reqAsJson = await req.json() as { response: { access_token: string, user_id: string } };

  if ('error' in reqAsJson) {
    throw reqAsJson.error;
  }

  let userId: string | null = null;

  try {
    await fastify.cdb.transaction(async (trx) => {
      const tableKnex = trx.table<UsersTable>('users');
      const profilesTable = trx.table<ProfilesTable>('profiles');

      const existedData: UsersTable | undefined = await tableKnex.where('vkId', reqAsJson.response.user_id).first();
      const isExist = !!existedData;

      userId = existedData?.id ?? uuidv4();


      if (isExist) {
        await tableKnex.update({ vkAccessToken: reqAsJson.response.access_token }).where('vkId', reqAsJson.response.user_id);
      } else {
        const userInsert: UsersTable = {
          vkAccessToken: reqAsJson.response.access_token,
          vkId: reqAsJson.response.user_id,
          id: userId,
        }
        await tableKnex.insert(userInsert);

        const profileInsert: ProfilesTable = {
          id: uuidv4(),
          userId: userId,
          surname: lastname,
          firstname: firstname,
        }
        await profilesTable.insert(profileInsert);
      }
    })
  } catch (e) {
    fastify.log.error(e);
    throw new Error('Error with db, exchange vk token')
  }

  if (!userId) {
    throw new Error('userId does not filled');
  }

  const jwt = new JwtCreator({ vkId: reqAsJson.response.user_id, sub: userId }, fastify.envConfig.ACCESS_SECRET).withExpiresIn('90d');
  return await jwt.create()
}
