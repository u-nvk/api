import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.profiles, (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.uuid('userId').references('id').inTable(TableName.users).notNullable();
    tableBuilder.string('surname').notNullable();
    tableBuilder.string('firstname').notNullable();
    tableBuilder.boolean('isDriver').notNullable().defaultTo(false);

    tableBuilder.unique(['userId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableName.profiles);
}
