import {FastifyInstance} from "fastify";
import {insertOrUpdateUsersAndProfiles} from "./insert-or-update-user.handler";

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
  const reqAsJson = await req.json() as { response: { access_token: string, user_id: number } };

  if ('error' in reqAsJson) {
    throw reqAsJson.error;
  }

  return await insertOrUpdateUsersAndProfiles(fastify, reqAsJson.response.user_id, reqAsJson.response.access_token, firstname, lastname);
}
