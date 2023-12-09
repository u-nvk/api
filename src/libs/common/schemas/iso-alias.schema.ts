import { S, StringSchema } from 'fluent-json-schema';

export const ISO: () => StringSchema = () => S.string().format('date-time');
