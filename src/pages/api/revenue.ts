import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "~/backend/connection";
import { OrderItem } from "~/backend/models";
import { getRange, getPercentageText } from "./orders";
import { subMonths } from "date-fns";

const getSum = async (date: string | Date) => {
  const db = await getConnection();
  const { end, start } = getRange(date);
  const [result] = await OrderItem.query(db)
    .joinRelated("order")
    .where("date", "<=", end)
    .where("date", ">=", start)
    .sum("order.total");

  return (result as any).sum || 0;
};
export default async function revenue(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const date = req.query.date as string;
  const before = subMonths(new Date(date), 1);
  const sum = await getSum(date);
  const previousSum = await getSum(before);
  const percentage = ((sum - previousSum) / previousSum) * 100;
  const text = getPercentageText(percentage, new Date(date), before);

  return res.status(200).json({ revenue: sum, text });
}
