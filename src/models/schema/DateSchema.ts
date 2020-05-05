import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type DateSchema<P = unknown> = {
  type: "date";
  optional?: OptionalFlag<P>;
  validationFn?: ValidationFn<Date, P>;
};
