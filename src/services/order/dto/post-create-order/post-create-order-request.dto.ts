import { S } from 'fluent-json-schema';

export type NVK = 'NVK';

export type RouteFromNvk = {
  from: NVK,
  to: string,
}

export type RouteToNvk = {
  from: string,
  to: NVK,
}

export interface PostCreateOrderRequestDto {
  route: RouteFromNvk | RouteToNvk;
  price: number;
  transportId: string;
  timeStart: string;
  startFreeSeatCount: number;
}

export const PostCreateOrderRequestDtoSchema = S.object()
  .prop('route', S.oneOf([
    S.object()
      .prop('from', S.const('NVK')).required()
      .prop('to', S.string())
      .required(),
    S.object()
      .prop('from', S.string()).required()
      .prop('to', S.const('NVK'))
      .required(),
  ]))
  .prop('price', S.number()).description('Стоимость проезда с человека')
  .required()
  .prop('transportId', S.string())
  .description('Айди транспорта')
  .required()
  .prop('timeStart', S.string())
  .description('Время начала поездки в ISO формате')
  .required()
  .prop('startFreeSeatCount', S.number().minimum(1))
  .description('Количество свободных мест')
  .required();
