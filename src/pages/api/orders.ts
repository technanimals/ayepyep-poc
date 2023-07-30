import { NextApiRequest, NextApiResponse } from "next";

import { getConnection } from "~/backend/connection";
import { Order } from "~/backend/models";

import { QueryType } from "~/query";

const getPizzasSales = async (order: "DESC" | "ASC", date: string) => {
  const db = await getConnection();

  const { rows } = await db.raw(`
  SELECT pizza.name, s.count, date FROM pizza
  JOIN (
    SELECT pizza_id, count(pizza_id) as count FROM order_item
    GROUP BY pizza_id ORDER BY count ${order} LIMIT 5
  ) s on s.pizza_id = pizza.id ORDER BY s.count ${order}
  JOIN order ON order.id = order_item.order_id
  `);
  console.log(rows);

  return rows;
};

const getTopPizzas = async (date: string) => getPizzasSales("DESC", date);
const getWorstPizzas = async (date: string) => getPizzasSales("ASC", date);
const countOrders = async (date: string) => {
  const db = await getConnection();

  const data = await Order.query(db).count("*").first();

  return data;
};

const queries: Record<QueryType, (date: string) => Promise<any>> = {
  [QueryType.TOP_PIZZAS]: getTopPizzas,
  [QueryType.WORST_PIZZAS]: getWorstPizzas,
  [QueryType.ORDER_COUNT]: countOrders,
};

export default async function orders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type as QueryType | undefined;
  const date = req.query.date as string;

  if (!type) {
    return res.status(200).json([]);
  }

  const query = queries[type];

  if (!query) {
    return res.status(200).json([]);
  }

  try {
    const data = await query(date);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);

    res.status(400).send({});
  }
}
