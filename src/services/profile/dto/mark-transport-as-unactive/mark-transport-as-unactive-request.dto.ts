import { S } from 'fluent-json-schema';
import { UUID } from '@libs/common';

export interface MarkTransportAsUnactiveUrlParam {
  id: string;
}

export const MarkTransportAsUnactiveUrlParamSchema = S.object()
  .prop('id', UUID()).description('Айди транспорта').required();
