import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";
export declare type ArraySchema<T> = BaseSchema & {
    type: "array";
    minItems: number;
    maxItems: number;
    items: Schema<T>;
};
