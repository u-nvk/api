import { S } from 'fluent-json-schema';

export const GetOrderHistoryRequestQuerySchema = S.object()
  .prop('role', S.enum(['driver', 'participant'])).required();

export interface GetOrderHistoryRequestQuery {
  role: 'driver' | 'participant';
}
