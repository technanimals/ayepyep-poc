import knex, { Knex } from "knex";
import { config } from "~/config";

let connection: Knex;

export const getConnection = async () => {
  if (connection) {
    return connection;
  }

  connection = knex({
    client: "pg",
    connection: config.url,
    searchPath: ["demo", "public"],
    // debug: stage !== 'prod',
    debug: false,
    pool: { min: 1, max: config.pool },
  });

  return connection;
};
