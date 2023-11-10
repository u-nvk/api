import { S } from 'fluent-json-schema';

export interface PostExchangeAccessVkTokenRequestDto {
  vkAccessToken: string;
  vkId: number;
}

export const PostExchangeAccessVkTokenRequestDtoSchema = S.object()
  .prop('vkAccessToken', S.string()).description('Аксес токен из ВК').required()
  .prop('vkId', S.number())
  .description('Айди пользователя в ВК')
  .required();
