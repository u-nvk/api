import { S } from 'fluent-json-schema';
import { UUID } from '@libs/common';

export interface GetTransportsResponseDto {
  transports: {
    id: string,
    name: string,
    plateNumber: string,
    color: string
  }[];
}

export const GetTransportsResponseDtoSchema = S.object()
  .prop('transports', S.array().items(
    S.object()
      .prop('id', UUID()).required()
      .prop('name', S.string())
      .description('Фирма и марка')
      .required()
      .prop('plateNumber', S.string())
      .description('Номер')
      .required()
      .prop('color', S.string())
      .description('Цвет')
      .required(),
  ));
