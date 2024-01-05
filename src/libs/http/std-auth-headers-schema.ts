import { S } from 'fluent-json-schema';

export const StdAuthHeadersSchema = S.object()
  .prop('Content-Type', S.const('application/json')).required()
  .prop('Authorization', S.string())
  .required();

export const StdOnlyAuthHeadersSchema = S.object()
  .prop('Authorization', S.string());
