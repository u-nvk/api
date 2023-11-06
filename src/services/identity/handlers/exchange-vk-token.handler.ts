import {FastifyInstance} from "fastify";
import {UsersTable} from "../db/users.table";
import { v4 as uuidv4 } from 'uuid';
import {JwtCreator} from "../../../libs/jwt";

export const exchangeVkTokenHandler = async (fastify: FastifyInstance, vkTokenToExchange: string, vkUuid: string): Promise<string> => {
  // https://api.vk.com/method/auth.exchangeSilentAuthToken" -d "v=5.131&token=aTUVkQ0JJmC5AuNRh5L6k6iQH1ue9XUhT42QDW_kiSDcDMfVOZrxlIafMylGvcDcisCEzUdHr91UYD8xhbLWOfdi3YbmuuhQ_6zRiG3ZQiuBlsQfYFXMrkdtoSOdG9zqIVK0Oprj1ygtNWkbLEaqJpDNjmZ_fQnRwVayWQPvv1I2GMPym6IaKmLBpdNxXtqdk93O6mqEUpcmjKRhG45QSKK4-vWpNWGCHuGSwiibNqe4KimXKnnPLpj1-dWyOXLHsjCnwGQ_IiBEGAXh2Ldkpzqw6rXnhi5ykkCtjNsPGlrDvMLXhvIsls5H6cuiFATmLne3r1LhOoEvDqr4ylphOKgBcLeMm-mCuO5Gv-P54U6C2QXUONldoJ5TkD_5cNbZ&access_token=55a55ebc55a55ebc55a55ebc2d56b37167555a555a55ebc30e3149fa6bf5272b51701ee&uuid=ig1hOj3F-qDla3BK1eXGj
  const urlPath = `https://${fastify.envConfig.VK_API_DOMAIN}/${fastify.envConfig.VK_API_EXCHANGE_METHOD}`
  console.log(process.env.VK_API_DOMAIN);
  const req = await fetch(urlPath, {
    method: 'POST',
    body: JSON.stringify({
      v: 5.131,
      token: vkTokenToExchange,
      access_token: fastify.envConfig.VK_SERVICE_TOKEN,
      uuid: vkUuid
    })
  })
  const reqAsJson = await req.json() as { access_token: string, user_id: string };

  const tableKnex = fastify.cdb.table<UsersTable>('users');

  const existedData: UsersTable = await tableKnex.where('vkId', reqAsJson.user_id).first();
  const isExist = !!existedData;

  const userId = existedData.id ?? uuidv4();

  if (isExist) {
    await tableKnex.update({ vkAccessToken: reqAsJson.access_token }).where('vkId', reqAsJson.user_id);
  } else {
    await tableKnex.insert({ vkAccessToken: reqAsJson.access_token, vkId: reqAsJson.user_id, id: userId });
  }

  const jwt = new JwtCreator({ vkId: reqAsJson.user_id, sub: userId }, fastify.envConfig.ACCESS_SECRET).withExpiresIn('90d');
  return await jwt.create()
}
