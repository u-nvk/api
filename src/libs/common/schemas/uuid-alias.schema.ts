import { S, StringSchema } from 'fluent-json-schema';

export const UUID: () => StringSchema = () => S.string().format('uuid');
