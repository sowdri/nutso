import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";

export type ArraySchema<T> = BaseSchema & {
  type: "array";
  minItems: number;
  maxItems: number;
  item: Schema<T>;
};
