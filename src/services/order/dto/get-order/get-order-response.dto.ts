import { S } from 'fluent-json-schema';

export interface GetOrderResponseDto {
  id: string;
  driverPid: string;
  price: number;
  route: {
    from: string;
    to: string;
  },
  driver: {
    firstname: string;
    surname: string;
    vkId: number;
  },
  participants: {
    firstname: string;
    surname: string;
    vkId: number;
  }[],
  transport: {
    plateNumber: string;
    color: string;
    name: string;
  },
  timeStart: string;
}

const userData = S.object()
  .prop('firstname', S.string()).required()
  .prop('surname', S.string())
  .required()
  .prop('vkId', S.number())
  .required();

export const GetOrderResponseDtoSchema = S.object()
  .prop('id', S.string()).required()
  .prop('driverPid', S.string())
  .required()
  .prop('price', S.number())
  .required()
  .prop(
    'route',
    S.object()
      .prop('from', S.string()).required()
      .prop('to', S.string())
      .required(),
  )
  .required()
  .prop(
    'transport',
    S.object()
      .prop('plateNumber', S.string())
      .required()
      .prop('color', S.string())
      .required()
      .prop('name', S.string())
      .required(),
  )
  .required()
  .prop('timeStart', S.string())
  .required()
  .prop(
    'driver',
    userData,
  )
  .required()
  .prop(
    'participants',
    S.array().items(
      userData,
    ),
  )
  .required();
