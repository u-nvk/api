import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.users, (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.string('vkAccessToken');
    tableBuilder.string('vkId').notNullable();

    tableBuilder.unique(['vkAccessToken', 'vkId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableName.users);
}
