// import { BaseSchema } from "./BaseSchema";
import { ValidationFn } from "../ValidationFn";
import { OptionalFlag } from "../OptionalFlag";

export type DateSchema<R> = {
  type: "date";
  optional?: OptionalFlag<R>;
  validationFn?: ValidationFn<Date, R>;
};
