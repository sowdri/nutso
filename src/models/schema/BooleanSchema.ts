import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type BooleanSchema<P = unknown> = {
  type: "boolean";
  optional?: OptionalFlag<P>;
  validationFn?: ValidationFn<boolean, P>;
};
