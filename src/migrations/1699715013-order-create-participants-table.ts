import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.participants, (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.uuid('orderId').notNullable().references('id').inTable(TableName.orders);
    tableBuilder.uuid('userId').notNullable().references('id').inTable(TableName.users);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableName.participants);
}
