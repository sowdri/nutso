import { BaseSchema } from "./BaseSchema";
import { ValidationFn } from "../ValidationFn";

export type StringSchema<R> = BaseSchema & {
  type: "string";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validationFn?: ValidationFn<string, R>;
};
