import { S } from 'fluent-json-schema';

export interface GetOrderRequestUrlParam {
  orderId: string;
}

export const GetOrderRequestUrlParamSchema = S.object().prop('orderId', S.string()).required();
