import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { BaseSchema } from "./BaseSchema";

export type NumberSchema<R = number, P = unknown> = BaseSchema<number, R, P> & {
  type: "number";
  min?: number;
  max?: number;
  pattern?: RegExp;
};
