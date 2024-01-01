import { S } from 'fluent-json-schema';
import { UUID } from '@libs/common';

export interface GetDataByUseridRequestUrlParam {
  userPid: string;
}

export const GetDataByUseridRequestUrlParamSchema = S.object()
  .prop('userPid', UUID()).description('Айди профиля пользователя').required();
