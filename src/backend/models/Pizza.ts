import { Model } from "objection";
import { Order } from "./Order";

export class Pizza extends Model {
  static tableName = "pizza";
  // Tables Columns
  id: string;
  name: string;
  ingredients: string[];
  price: number;
  category: string;
  size: "S" | "M" | "L" | "XL" | "XXL";

  static get relationMappings() {
    return {
      orders: {
        relation: Model.ManyToManyRelation,
        modelClass: Order,
        join: {
          from: "pizza.id",
          through: {
            from: "order_item.pizza_id",
            to: "order_item.order_id",
          },
          to: "order.id",
        },
      },
    };
  }
}
