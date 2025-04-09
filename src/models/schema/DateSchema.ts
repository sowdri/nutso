import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { BaseSchema } from "./BaseSchema";

export type DateSchema<R = Date, P = unknown> = BaseSchema<Date, R, P> & {
  type: "date";
};
