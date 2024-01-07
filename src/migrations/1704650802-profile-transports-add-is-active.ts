import { Knex } from 'knex';
import { TableName } from '@libs/tables';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TableName.transports, (tb) => {
    tb.boolean('isActive').notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TableName.transports, (tb) => {
    tb.dropColumn('isActive');
  });
}
