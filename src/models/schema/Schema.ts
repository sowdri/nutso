import { ArraySchema } from "./ArraySchema";
import { BooleanSchema } from "./BooleanSchema";
import { DateSchema } from "./DateSchema";
import { NumberSchema } from "./NumberSchema";
import { ObjectSchema } from "./ObjectSchema";
import { StringSchema } from "./StringSchema";
import { TupleSchema } from "./TupleSchema";

/**
 * # Terminology (Only required to refer the code)
 * T => Type of the value currently being validated
 * K => key => Type of Key
 * R => root => The root of the object that is being validated
 * P => parent => The parent of the object being validated. If for [K in keyof T],
 */

export type Schema<T, R = T, P = unknown> = T extends string
  ? StringSchema<R, P>
  : T extends number
  ? NumberSchema<R, P>
  : T extends Date
  ? DateSchema<R, P>
  : T extends boolean
  ? BooleanSchema<R, P>
  : T extends Array<infer E>
  ? ArraySchema<E, T, R, P>
  : T extends [infer U, ...unknown[]]
  ? TupleSchema<U, R, P>
  : T extends Object
  ? ObjectSchema<T, R, P>
  : never;
