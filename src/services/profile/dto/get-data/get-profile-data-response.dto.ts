import { S } from 'fluent-json-schema';

export interface GetProfileDataResponseDto {
  id: string;
  userId: string;
  surname: string;
  firstname: string;
  phone: string | null;
  bank: number | null;
}

export const GetProfileDataResponseDtoSchema = S.object()
  .prop('id', S.string().description('Идентификатор профиля')).required()
  .prop('userId', S.string().description('Идентификатор пользователя'))
  .required()
  .prop('surname', S.string().description('Фамилия пользователя'))
  .required()
  .prop('firstname', S.string().description('Имя пользователя'))
  .required()
  .prop('phone', S.string().pattern(/^[0-9]*$/gm).maxLength(11).minLength(11)
    .description('Номер телефона в формате 70000000000'))
  .prop('bank', S.number());
