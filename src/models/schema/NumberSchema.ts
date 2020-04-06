import { BaseSchema } from "./BaseSchema";
import { ValidationFn } from "../ValidationFn";

export type NumberSchema<R> = BaseSchema & {
  type: "number";
  min?: number;
  max?: number;
  pattern?: RegExp;
  validationFn?: ValidationFn<number, R>;
};
