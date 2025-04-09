import { OptionalFlag } from "../OptionalFlag";
import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";

/**
 * E => Element
 * T => Type (this is the array)
 * P => Parent of the array
 *
 * Look at this type, we need all 3 types
 */
export type ArraySchema<E, T extends E[], R, P = unknown> = BaseSchema<
  T,
  R,
  P
> & {
  type: "array";
  minItems?: number;
  maxItems?: number;
  items: Schema<E, R>; // TODO check how this works in schema definition
};
