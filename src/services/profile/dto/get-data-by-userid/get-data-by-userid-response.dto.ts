import { S } from 'fluent-json-schema';

export interface GetDataByUseridResponseDto {
  payments: {
    phone: string;
    bank: number;
  }[]
}

export const GetDataByUseridResponseDtoSchema = S.object()
  .prop(
    'payments',
    S.array().items(
      S.object()
        .prop('phone', S.string()).required()
        .prop('bank', S.number())
        .required(),
    ).required(),
  );
