// import { BaseSchema } from "./BaseSchema";
import { ValidationFn } from "../ValidationFn";
import { OptionalFlag } from "../OptionalFlag";

export type StringSchema<R> = {
  type: "string";
  optional?: OptionalFlag<R>;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validationFn?: ValidationFn<string, R>;
};
