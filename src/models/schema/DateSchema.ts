import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { BaseSchema } from "./BaseSchema";

export type DateSchema = BaseSchema<Date> & {
  type: "date";
};
