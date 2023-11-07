import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('profiles', (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.uuid('userId').references('id').inTable('users').notNullable();
    tableBuilder.string('surname').notNullable();
    tableBuilder.string('firstname').notNullable();

    tableBuilder.unique(['userId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('profiles');
}
