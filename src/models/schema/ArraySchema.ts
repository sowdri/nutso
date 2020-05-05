import { Schema } from "./Schema";
import { OptionalFlag } from "../OptionalFlag";
// import { BaseSchema } from "./BaseSchema";

export type ArraySchema<T, R> = {
  type: "array";
  optional?: OptionalFlag<R>;
  minItems?: number;
  maxItems?: number;
  items: Schema<T, R>;
};
