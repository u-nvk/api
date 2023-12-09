import { S } from 'fluent-json-schema';

export interface GetOrderHistoryResponseDto {
  list: {
    id: string;
    orderId: string;
    userPid: string;
    driverPid: string;
    price: number;
    timeStart: string;
    transport: {
      from: string;
      to: string;
    }
  }[]
}

export const GetOrderHistoryResponseDtoSchema = S.object()
  .prop('list', S.array().items(S.object()
    .prop('orderId', S.string()).description('Айди поездки').required()
    .prop('userPid', S.string())
    .description('Айди профиля пользователя, который участвовал в поездке')
    .required()
    .prop('driverPid', S.string())
    .description('Айди профиля водителя')
    .required()
    .prop('price', S.number())
    .description('Цена')
    .required()
    .prop('timeStart', S.string())
    .description('Время начала поездки ISO')
    .required()
    .prop('transport', S.object()
      .prop('from', S.string()).description('Откуда').required()
      .prop('to', S.string().description('Куда'))
      .required())
    .required()))
  .required();
