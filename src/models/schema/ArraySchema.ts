import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";

export type ArraySchema<T, R> = BaseSchema & {
  type: "array";
  minItems?: number;
  maxItems?: number;
  items: Schema<T, R>;
};
