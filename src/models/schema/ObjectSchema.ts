import { Schema } from "./Schema";
import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { BaseSchema } from "./BaseSchema";

export type ObjectSchema<T, R = T, P = unknown> = BaseSchema<T, R, P> & {
  type: "object";
  properties: {
    [K in keyof T]: Schema<T[K], R, T>;
  };
};
