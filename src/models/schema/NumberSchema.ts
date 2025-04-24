import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { BaseSchema } from "./BaseSchema";

export type NumberSchema = BaseSchema<number> & {
  type: "number";
  min?: number;
  max?: number;
  pattern?: RegExp;
};
