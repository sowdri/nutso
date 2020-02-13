import { BaseSchema } from "./BaseSchema";
export declare type StringSchema = BaseSchema & {
    type: "string";
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
};
