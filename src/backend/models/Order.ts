import { Model } from "objection";
import { Pizza } from "./Pizza";

export class Order extends Model {
  static tableName = "order";

  id: string;
  date: Date;

  static get relationMappings() {
    return {
      pizzas: {
        relation: Model.HasManyRelation,
        modelClass: Pizza,
        join: {
          from: "order.id",
          to: "order_item.order_id",
        },
      },
    };
  }
}
