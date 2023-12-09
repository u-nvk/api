import { S } from 'fluent-json-schema';
import { UUID } from '@libs/common';

export interface DeleteUnjoinToOrderRequestUrlParam {
  orderId: string;
}

export const DeleteUnjoinToOrderRequestUrlParamSchema = S.object().prop('orderId', UUID()).required();
