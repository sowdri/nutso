import { OptionalFlag } from "../OptionalFlag";
import { Schema } from "./Schema";

/**
 * E => Element
 * T => Type (this is the array)
 * P => Parent of the array
 *
 * Look at this type, we need all 3 types
 */
export type ArraySchema<E, T extends E[], P> = {
  type: "array";
  optional?: OptionalFlag<P>;
  minItems?: number;
  maxItems?: number;
  items: Schema<E, T>;
};
