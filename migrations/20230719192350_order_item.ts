import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("order_item", (t) => {
    t.string("pizza_id").references("id").inTable("pizza").notNullable();
    t.string("order_id").references("id").inTable("order").notNullable();
    t.integer("quantity").notNullable();
    t.primary(["pizza_id", "order_id"]);
    t.float("total").notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("order_item");
}
