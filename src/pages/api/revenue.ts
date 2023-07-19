import { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "~/backend/connection";
import { OrderItem } from "~/backend/models";

export default async function revenue(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getConnection();
  const [result] = await OrderItem.query(db).sum("total");
  return res.status(200).json({ revenue: (result as any).sum });
}
