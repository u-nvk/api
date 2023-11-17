import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.orders, (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.uuid('driverId').notNullable().references('id').inTable(TableName.users);
    tableBuilder.uuid('routeId').notNullable().references('id').inTable(TableName.routes);
    tableBuilder.integer('price').notNullable();
    tableBuilder.uuid('transportId').references('id').inTable(TableName.transports);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableName.orders);
}
