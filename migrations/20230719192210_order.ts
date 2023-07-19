import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("order", (t) => {
    t.string("id").primary().notNullable();
    t.dateTime("date").notNullable();
    t.float("total").notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("order");
}
