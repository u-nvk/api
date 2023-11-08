import {FastifyInstance} from "fastify";
import {sendFormUrlencoded} from "../../../libs/http/send-form-urlencoded";

export type SuccessRelationApprove = {
  isApproved: true;
  userFirstname: string;
  userLastname: string;
};

export type FailedRelationApprove = {
  isApproved: false;
};

export type ReturnApproveVkIdAndVkAccessTokenRelation = SuccessRelationApprove | FailedRelationApprove;

/**
 * Метод подтверждает, что переданный vkAccessToken это токен для пользователя с переданным vkId
 * @param {FastifyInstance} fastify
 * @param {number} vkId - айди пользователя в вк
 * @param {string} vkAccessToken - аксес токен пользователя
 * @return {Promise<ReturnApproveVkIdAndVkAccessTokenRelation>}
 */
export const approveVkIdAndVkAccessTokenRelation = async (fastify: FastifyInstance, vkId: number, vkAccessToken: string): Promise<ReturnApproveVkIdAndVkAccessTokenRelation> => {
  const url = `https://${fastify.envConfig.VK_API_DOMAIN}/${fastify.envConfig.VK_API_GET_PROFILE_INFO_METHOD}`;

  const dataBody = {
    access_token: vkAccessToken,
    v: 5.154,
  }

  type Error = { error: { error_msg: string } };
  type Success = { response: { id: number, first_name: string, last_name: string } };


  const json = await sendFormUrlencoded<Error | Success>(url, dataBody);


  if ('error' in json) {
    fastify.log.error(json);
    throw new Error('Failed get profile req', { cause: json });
  }

  if (json.response.id === vkId) {
    return { isApproved: true, userFirstname: json.response.first_name, userLastname: json.response.last_name };
  }

  return { isApproved: false };
}
