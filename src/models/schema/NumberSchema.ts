import { ValidationFn } from "../ValidationFn";
import { OptionalFlag } from "../OptionalFlag";

export type NumberSchema<R> = {
  type: "number";
  min?: number;
  max?: number;
  pattern?: RegExp;
  optional?: OptionalFlag<R>;
  validationFn?: ValidationFn<number, R>;
};
