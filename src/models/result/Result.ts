import { ArrayResult } from "./ArrayResult";
import { BooleanResult } from "./BooleanResult";
import { DateResult } from "./DateResult";
import { NumberResult } from "./NumberResult";
import { ObjectResult } from "./ObjectResult";
import { StringResult } from "./StringResult";

// prettier-ignore
export type Result<T> = T extends string ? StringResult :
                        T extends number ? NumberResult :
                        T extends Date ? DateResult :
                        T extends boolean ? BooleanResult :
                        T extends Array<infer E> ? ArrayResult<E, T> : 
                        T extends Object ? ObjectResult<T> :
                        never;
