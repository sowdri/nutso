import { BaseSchema } from "./BaseSchema";

export type TupleSchema<T> = BaseSchema & {
  tuple: boolean;
};
