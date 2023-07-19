import { Model } from "objection";
import { Pizza } from "./Pizza";
import { Order } from "./Order";

export class OrderItem extends Model {
  static tableName = "order_item";
  // Tables Columns
  id: string;
  date: Date;
  pizzas: Pizza[];
  order: Order;

  static get relationMappings() {
    return {
      pizzas: {
        relation: Model.HasManyRelation,
        modelClass: Pizza,
        join: {
          from: "order_item.pizza_id",
          to: "pizza.id",
        },
      },
      order: {
        relation: Model.HasOneRelation,
        modelClass: Order,
        join: {
          from: "order_item.order_id",
          to: "order.id",
        },
      },
    };
  }
}
