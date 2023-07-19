import { Knex } from "knex";
import env from "env-var";
import "dotenv/config";
// @ts-ignore
import knexStringCase from "knex-stringcase";
import { resolve } from "path";

const root = process.cwd();

export const database = {
  url: env.get("DATABASE_URL").required().asString(),
  pool: env.get("DATABASE_POOL").default(5).asIntPositive(),
};

export const config: Knex.Config = {
  client: "pg",
  connection: database.url,
  // debug: stage !== 'prod',
  debug: false,
  pool: { min: 1, max: database.pool },
  migrations: {
    directory: resolve(root, "migrations"),
  },
  seeds: {
    directory: resolve(root, "seeds"),
  },
};

export default knexStringCase(config);
