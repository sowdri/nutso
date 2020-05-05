import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type StringSchema<P = unknown> = {
  type: "string";
  optional?: OptionalFlag<P>;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validationFn?: ValidationFn<string, P>;
};
