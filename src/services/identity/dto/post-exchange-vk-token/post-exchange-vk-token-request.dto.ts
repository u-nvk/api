import { S } from 'fluent-json-schema';

export interface PostExchangeVkTokenRequestDto {
  /**
   * Silent token
   * https://dev.vk.com/ru/vkid/tokens/silent-token
   */
  vkToken: string;
  vkUuid: string
}

export const PostExchangeVkTokenRequestDtoSchema = S.object()
  .prop('vkToken', S.string())
  .prop('vkUuid', S.string())
