import { ArraySchema } from "./ArraySchema";
import { BooleanSchema } from "./BooleanSchema";
import { DateSchema } from "./DateSchema";
import { NumberSchema } from "./NumberSchema";
import { ObjectSchema } from "./ObjectSchema";
import { StringSchema } from "./StringSchema";

/**
 * # Terminology (Only required to refer the code)
 * T => Type of the value currently being validated
 * K => key => Type of Key
 * R => root => The root of the object that is being validated. Default is 'unknown' for better composability.
 *      When using validationFn or isApplicableFn that need type safety for the root object,
 *      explicitly specify R as the root type.
 * P => parent => The parent of the object being validated. If for [K in keyof T],
 */

export type Schema<T> = T extends string
  ? StringSchema
  : T extends number
  ? NumberSchema
  : T extends Date
  ? DateSchema
  : T extends boolean
  ? BooleanSchema
  : T extends Array<infer E>
  ? ArraySchema<E, T>
  : T extends Object
  ? ObjectSchema<T>
  : never;
