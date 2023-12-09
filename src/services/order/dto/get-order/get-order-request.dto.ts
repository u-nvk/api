import { S } from 'fluent-json-schema';
import { UUID } from '@libs/common';

export interface GetOrderRequestUrlParam {
  orderId: string;
}

export const GetOrderRequestUrlParamSchema = S.object().prop('orderId', UUID()).required();
