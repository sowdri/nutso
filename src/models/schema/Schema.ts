import { ArraySchema } from "./ArraySchema";
import { BooleanSchema } from "./BooleanSchema";
import { DateSchema } from "./DateSchema";
import { NumberSchema } from "./NumberSchema";
import { ObjectSchema } from "./ObjectSchema";
import { StringSchema } from "./StringSchema";
import { TupleSchema } from "./TupleSchema";

// prettier-ignore
export type Schema<T, R = T> = T extends string ? StringSchema<R> :
                        T extends number ? NumberSchema :
                        T extends Date ? DateSchema :
                        T extends boolean ? BooleanSchema :
                        T extends Array<infer E> ? ArraySchema<E, R> : 
                        T extends [infer U, ...unknown[]] ? TupleSchema<U> :
                        T extends Object ? ObjectSchema<T, R> :
                        never;
