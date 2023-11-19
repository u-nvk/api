import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.orders, (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.uuid('driverPid').notNullable().references('id').inTable(TableName.profiles);
    tableBuilder.uuid('routeId').notNullable().references('id').inTable(TableName.routes);
    tableBuilder.integer('price').notNullable();
    tableBuilder.uuid('transportId').references('id').inTable(TableName.transports);
    tableBuilder.integer('startFreeSeatCount').notNullable();
    tableBuilder.timestamp('timeStart').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableName.orders);
}
