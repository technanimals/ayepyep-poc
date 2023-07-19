import { NextApiRequest, NextApiResponse } from "next";

import { getConnection } from "~/backend/connection";
import { Order } from "~/backend/models";

import { QueryType } from "~/query";

const getPizzasSales = async (order: "DESC" | "ASC") => {
  const db = await getConnection();

  const { rows } = await db.raw(`
  SELECT pizza.name, s.count FROM pizza
  JOIN (
    SELECT pizza_id, count(pizza_id) as count FROM order_item
    GROUP BY pizza_id ORDER BY count DESC LIMIT 5
  ) s on s.pizza_id = pizza.id ORDER BY s.count ${order};
  `);

  return rows;
};

const getTopPizzas = async () => getPizzasSales("DESC");
const getWorstPizzas = async () => getPizzasSales("ASC");
const countOrders = async () => {
  const db = await getConnection();

  const data = await Order.query(db).count("*").first();

  return data;
};

const queries: Record<QueryType, () => Promise<any>> = {
  [QueryType.TOP_PIZZAS]: getTopPizzas,
  [QueryType.WORST_PIZZAS]: getWorstPizzas,
  [QueryType.ORDER_COUNT]: countOrders,
};

export default async function orders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type as QueryType | undefined;

  if (!type) {
    return res.status(200).json([]);
  }

  const query = queries[type];

  if (!query) {
    return res.status(200).json([]);
  }

  try {
    const data = await query();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(400).send({});
  }
}
