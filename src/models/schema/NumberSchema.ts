import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type NumberSchema<R = number, P = unknown> = {
  type: "number";
  min?: number;
  max?: number;
  pattern?: RegExp;
  optional?: OptionalFlag<R, P>;
  validationFn?: ValidationFn<number, R, P>;
};
