import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type DateSchema<R = Date, P = unknown> = {
  type: "date";
  optional?: OptionalFlag<R, P>;
  validationFn?: ValidationFn<Date, R, P>;
};
