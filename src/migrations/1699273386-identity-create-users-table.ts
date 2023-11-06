import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.string('vkAccessToken');
    tableBuilder.string('vkId').notNullable();

    tableBuilder.unique(['vkAccessToken', 'vkId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
