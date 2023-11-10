import { S } from 'fluent-json-schema';

export interface PostDataRequestDto {
  paymentMethods: { phone: string, bank: number }[];
}

export const PostDataRequestDtoSchema = S.object()
  .prop('paymentMethods',
    S.array()
      .items(
        S.object()
          .prop('phone', S.string().pattern(/^[0-9]*$/gm).maxLength(11).minLength(11).description('Номер телефона в формате 70000000000')).required()
          .prop('bank', S.number()).required()
      ).required()
  )
