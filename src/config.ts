import * as env from "env-var";

export const config = {
  url: env.get("DATABASE_URL").required().asString(),
  pool: env.get("DATABASE_POOL").default(5).asIntPositive(),
};
