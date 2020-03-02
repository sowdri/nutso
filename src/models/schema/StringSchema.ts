import { BaseSchema } from "./BaseSchema";
import { ValidatorFn } from "../custom/ValidatorFn";

export type StringSchema<R> = BaseSchema & {
  type: "string";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validatorFn?: ValidatorFn<string, R>;
};
