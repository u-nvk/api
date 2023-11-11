import { S } from 'fluent-json-schema';

export interface GetProfileDataResponseDto {
  userId: string;
  surname: string;
  firstname: string;
  isDriver: boolean;
  payments: {
    phone: string;
    bank: number;
  }[]
}

export const GetProfileDataResponseDtoSchema = S.object()
  .prop('userId', S.string().description('Идентификатор пользователя'))
  .required()
  .prop('surname', S.string().description('Фамилия пользователя'))
  .required()
  .prop('firstname', S.string().description('Имя пользователя'))
  .required()
  .prop('isDriver', S.boolean().description('Является ли пользователь водителем'))
  .required()
  .prop(
    'payments',
    S.array().items(
      S.object()
        .prop('phone', S.string()).required().description('Номер телефона в формате 70000000000')
        .prop('bank', S.number())
        .required()
        .description('Банк'),
    ),
  );
