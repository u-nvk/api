import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.transports, (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.string('name').notNullable();
    tableBuilder.string('plateNumber').notNullable();
    tableBuilder.string('color').notNullable();
    tableBuilder.uuid('ownerPid').notNullable().references('id').inTable(TableName.profiles);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableName.transports);
}
