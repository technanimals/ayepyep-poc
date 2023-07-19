import { Knex } from "knex";
import { resolve } from "path";
import * as xlsx from "xlsx";
import { chunk, unionBy, uniqBy } from "lodash";
import { faker } from "@faker-js/faker";
import { subMonths } from "date-fns";

const excelFilePath = resolve(__dirname, "data.xlsx");

const getDate = (date: string, time: string) => {
  const [day, month, year] = date.split("/");
  const [hour, minute, second] = time.split(":");

  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );
};

export async function seed(knex: Knex): Promise<void> {
  const workbook = xlsx.readFile(excelFilePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

  const header = data.shift() || [];
  const d = data.map((row) => {
    return row.reduce((acc: Record<string, string>, cur, i) => {
      acc[header[i]] = cur;
      return acc;
    }, {});
  }) as unknown as RootObject[];

  const pizzas = uniqBy(d, "pizza_id");
  const orders = uniqBy(d, "order_id");

  await knex("pizza")
    .insert(
      pizzas.map(
        ({
          pizza_id,
          pizza_name,
          pizza_ingredients,
          unit_price,
          pizza_category,
          pizza_size,
        }) => ({
          id: pizza_id,
          name: pizza_name,
          ingredients: pizza_ingredients.split(","),
          price: unit_price,
          category: pizza_category,
          size: pizza_size,
        })
      )
    )
    .onConflict("id")
    .ignore();

  await knex("order")
    .insert(
      orders.map(({ order_id, total_price }) => {
        const now = new Date();
        const past = subMonths(now, 6);

        return {
          id: order_id,
          date: faker.date.between({ from: past, to: now }),
          total: total_price,
        };
      })
    )
    .onConflict("id")
    .merge(["date"]);

  const orderItems = d.map(({ pizza_id, quantity, order_id, unit_price }) => ({
    pizza_id,
    quantity,
    order_id,
    total: unit_price * quantity,
  }));

  const batches = chunk(orderItems, 1000);

  for await (const batch of batches) {
    await knex("order_item")
      .insert(batch)
      .onConflict(["pizza_id", "order_id"])
      .ignore();
  }
}

export interface RootObject {
  order_details_id: number;
  order_id: number;
  pizza_id: string;
  quantity: number;
  order_date: number;
  order_time: number;
  unit_price: number;
  total_price: number;
  pizza_size: string;
  pizza_category: string;
  pizza_ingredients: string;
  pizza_name: string;
}
