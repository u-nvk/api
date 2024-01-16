import { S } from 'fluent-json-schema';
import { ISO, UUID } from '@libs/common';

export interface GetOrderHistoryResponseDto {
  list: {
    id: string;
    orderId: string;
    userPid: string;
    driverPid: string;
    price: number;
    timeStart: string;
    route: {
      from: string;
      to: string;
    };
    isDeclined: boolean;
  }[]
}

export const GetOrderHistoryResponseDtoSchema = S.object()
  .prop('list', S.array()
    .items(
      S.object()
        .prop('orderId', UUID()).description('Айди поездки').required()
        .prop('userPid', UUID())
        .description('Айди профиля пользователя, который участвовал в поездке')
        .required()
        .prop('driverPid', UUID())
        .description('Айди профиля водителя')
        .required()
        .prop('price', S.number())
        .description('Цена')
        .required()
        .prop('timeStart', ISO())
        .description('Время начала поездки ISO')
        .required()
        .prop('route', S.object()
          .prop('from', S.string()).description('Откуда').required()
          .prop('to', S.string().description('Куда'))
          .required())
        .required()
        .prop('isDeclined', S.object())
        .required(),
    ))
  .required();
