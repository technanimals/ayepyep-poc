import { Knex } from "knex";

export async function up(knex: Knex) {
  return Promise.all([
    knex.schema.raw(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `),
  ]);
}

export async function down() {
  return Promise.all([]);
}
