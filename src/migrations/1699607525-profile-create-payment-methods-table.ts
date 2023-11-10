import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('payment-methods', (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.uuid('phone').notNullable();
    tableBuilder.integer('bank').notNullable();
    tableBuilder.string('ownerId').notNullable().references('id').inTable('uses');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('payment-methods');
}
