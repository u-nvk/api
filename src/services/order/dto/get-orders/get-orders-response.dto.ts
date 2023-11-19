import { S } from 'fluent-json-schema';

export interface GetOrdersResponseDto {
  orders: {
    id: string;
    driverPid: string;
    price: number;
    route: {
      from: string;
      to: string;
    },
    participantIds: string[],
    leftCount: number;
    timeStart: string;
  }[]
}

export const GetOrdersResponseDtoSchema = S.object()
  .prop('orders', S.array().items(
    S.object()
      .prop('id', S.string()).required()
      .prop('driverPid', S.string())
      .required()
      .prop('price', S.number())
      .required()
      .prop(
        'route',
        S.object()
          .prop('from', S.string())
          .prop('to', S.string()),
      )
      .required()
      .prop('participantIds', S.array().items(S.string()))
      .required()
      .prop('leftCount', S.number())
      .description('Количество свободных мест')
      .required()
      .prop('timeStart', S.string())
      .required(),
  ));
