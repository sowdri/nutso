import { BaseSchema } from "./BaseSchema";
export declare type NumberSchema = BaseSchema & {
    type: "number";
    min: number;
    max: number;
};
