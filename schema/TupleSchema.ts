import { BaseSchema } from "./BaseSchema";

export type TupleSchema<T> = BaseSchema & {
  type: "tuple";
};
