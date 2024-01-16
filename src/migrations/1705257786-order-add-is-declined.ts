import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TableName.orders, (tb) => {
    tb.boolean('isDeclined').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TableName.transports, (tb) => {
    tb.dropColumn('comment');
  });
}
