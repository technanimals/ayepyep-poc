import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("pizza", (t) => {
    t.string("id").primary().notNullable();
    t.string("name").notNullable();
    t.specificType("ingredients", "text[]").notNullable();
    t.float("price").notNullable();
    t.string("category").notNullable();
    t.enum("size", ["S", "M", "L", "XL", "XXL"]).notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("pizza");
}
