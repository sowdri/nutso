import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { BaseSchema } from "./BaseSchema";

export type BooleanSchema<R = boolean, P = unknown> = BaseSchema<
  boolean,
  R,
  P
> & {
  type: "boolean";
};
