import { S } from 'fluent-json-schema';

export const StdErrorResponseSchema = S.object()
  .prop('description', S.string());
