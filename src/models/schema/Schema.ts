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
 * P => Type of parent of T
 * K => Type of Key
 * root => The root of the object that is being validated
 * parent => The parent of the object being validated. If for [K in keyof T],
 */
// prettier-ignore
export type Schema<T, P = unknown> = T extends string ? StringSchema<P> :
                        T extends number ? NumberSchema<P> :
                        T extends Date ? DateSchema<P> :
                        T extends boolean ? BooleanSchema<P> :
                        T extends Array<infer E> ? ArraySchema<E, T, P> : 
                        T extends [infer U, ...unknown[]] ? TupleSchema<U,P> :
                        T extends Object ? ObjectSchema<T, P> :
                        never;
