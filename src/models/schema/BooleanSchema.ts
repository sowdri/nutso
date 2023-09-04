import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type BooleanSchema<R = boolean, P = unknown> = {
  type: "boolean";
  optional?: OptionalFlag<R, P>;
  validationFn?: ValidationFn<boolean, R, P>;
};
