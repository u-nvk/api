import { S } from 'fluent-json-schema';

export interface GetTransportsResponseDto {
  transports: {
    name: string,
    plateNumber: string,
    color: string
  }[];
}

export const GetTransportsResponseDtoSchema = S.object()
  .prop('transports', S.array().items(
    S.object()
      .prop('name', S.string()).description('Фирма и марка').required()
      .prop('plateNumber', S.string())
      .description('Номер')
      .required()
      .prop('color', S.string())
      .description('Цвет')
      .required(),
  ));
