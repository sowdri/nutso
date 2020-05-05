import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type NumberSchema<P = unknown> = {
  type: "number";
  min?: number;
  max?: number;
  pattern?: RegExp;
  optional?: OptionalFlag<P>;
  validationFn?: ValidationFn<number, P>;
};
