import { S } from 'fluent-json-schema';

export interface PostCreateTransportRequestDto {
  name: string,
  plateNumber: string,
  color: string
}

export const PostCreateTransportRequestDtoSchema = S.object()
  .prop('name', S.string()).description('Фирма и марка').required()
  .prop('plateNumber', S.string().pattern(/^([АВЕКМНОРСТУХ]{1}[0-9]{3}[АВЕКМНОРСТУХ]{2}[0-9]{2,3})?$/gm))
  .description('Номер')
  .required()
  .prop('color', S.string())
  .description('Цвет')
  .required();
