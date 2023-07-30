import { NextApiRequest, NextApiResponse } from "next";

import { getConnection } from "~/backend/connection";
import { Order, OrderItem } from "~/backend/models";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import subMonths from "date-fns/subMonths";

import { QueryType } from "~/query";

export const getRange = (date: string | Date) => ({
  start: startOfMonth(new Date(date)),
  end: endOfMonth(new Date(date)),
});

const getPizzasSales = async (order: "DESC" | "ASC", date: string) => {
  const db = await getConnection();
  const data = await OrderItem.query(db)
    .select("pizzas.name", db.raw("count(pizza_id) as count"))
    .joinRelated("order")
    .joinRelated("pizzas")
    .where("date", "<=", endOfMonth(new Date(date)))
    .where("date", ">=", startOfMonth(new Date(date)))
    .groupBy("pizzas.name")
    .orderBy("count", order)
    .limit(5);

  return data;
};

export const getPercentageText = (
  percentage: number,
  query: Date,
  previous: Date
) => {
  const now = new Date();

  const isSameMonth = query.getMonth() === now.getMonth();

  const sign = percentage > 0 ? "+" : "";

  const text = isSameMonth
    ? "from last month"
    : `from ${previous.toLocaleString("en-US", { month: "long" })}`;

  return `${sign}${percentage.toFixed(2)}% ${text}`;
};

const getTopPizzas = async (date: string) => getPizzasSales("DESC", date);
const getWorstPizzas = async (date: string) => getPizzasSales("ASC", date);
const countOrders = async (date: string) => {
  const now = getRange(date);
  const before = getRange(subMonths(new Date(date), 1));
  const db = await getConnection();

  // @ts-ignore
  const { count } = await Order.query(db)
    .count("*")
    .where("date", "<=", now.end)
    .where("date", ">=", now.start)
    .first();

  // @ts-ignore
  const { count: previous } = await Order.query(db)
    .count("*")
    .where("date", "<=", before.end)
    .where("date", ">=", before.start)
    .first();

  const percentage = parseInt(
    (((count - previous) / previous) * 100).toFixed(2)
  );

  return {
    count,
    percentage,
    text: getPercentageText(percentage, now.start, before.start),
  };
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
