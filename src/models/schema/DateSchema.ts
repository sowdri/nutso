import { BaseSchema } from "./BaseSchema";
import { ValidationFn } from "../ValidationFn";

export type DateSchema<R> = BaseSchema & {
  type: "date";
  validationFn?: ValidationFn<Date, R>;
};
