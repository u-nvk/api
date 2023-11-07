import { S } from 'fluent-json-schema';

export interface PostExchangeVkTokenRequestDto {
  /**
   * Silent token
   * https://dev.vk.com/ru/vkid/tokens/silent-token
   */
  vkToken: string;
  vkUuid: string;
  /**
   * Имя
   */
  firstname: string;
  /**
   * Фамилия
   */
  lastname: string;
}

export const PostExchangeVkTokenRequestDtoSchema = S.object()
  .prop('vkToken', S.string()).required()
  .prop('vkUuid', S.string()).required()
  .prop('firstname', S.string()).description('Имя').required()
  .prop('lastname', S.string()).description('Фамилия').required()
