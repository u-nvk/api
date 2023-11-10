import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('payment-methods', (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.string('phone').notNullable();
    tableBuilder.integer('bank').notNullable();
    tableBuilder.uuid('ownerId').notNullable().references('userId').inTable('profiles');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('payment-methods');
}
