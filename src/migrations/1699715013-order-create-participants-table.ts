import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.participants, (tableBuilder) => {
    tableBuilder.uuid('id', { primaryKey: true });
    tableBuilder.uuid('orderId').notNullable().references('id').inTable(TableName.orders)
      .onDelete('CASCADE');
    tableBuilder.uuid('userPid').notNullable().references('id').inTable(TableName.profiles)
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TableName.participants);
}
