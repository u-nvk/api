import { S } from 'fluent-json-schema';

export interface StdOnlyIdResponseDto {
  id: string;
}

export const StdOnlyIdResponseSchema = S.object().prop('id', S.string()).required();
