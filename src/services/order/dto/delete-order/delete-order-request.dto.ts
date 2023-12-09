import { S } from 'fluent-json-schema';
import { UUID } from '@libs/common';

export interface DeleteOrderRequestUrlParam {
  orderId: string;
}

export const DeleteOrderRequestUrlParamSchema = S.object().prop('orderId', UUID()).required();
