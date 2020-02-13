import { ArrayResult } from "./ArrayResult";
import { BooleanResult } from "./BooleanResult";
import { DateResult } from "./DateResult";
import { NumberResult } from "./NumberResult";
import { ObjectResult } from "./ObjectResult";
import { StringResult } from "./StringResult";
import { TupleSchema } from "./TupleResult";
export declare type Result<T> = T extends string ? StringResult : T extends number ? NumberResult : T extends Date ? DateResult : T extends boolean ? BooleanResult : T extends Array<infer E> ? ArrayResult<E> : T extends [infer U, ...unknown[]] ? TupleSchema<U> : T extends Object ? ObjectResult<T> : never;
