import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type DateSchema<P> = {
  type: "date";
  optional?: OptionalFlag<P>;
  validationFn?: ValidationFn<Date, P>;
};
