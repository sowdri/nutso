import { Schema } from "./Schema";
import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";

export type ObjectSchema<T, R = T, P = unknown> = {
  type: "object";
  optional?: OptionalFlag<R, P>;
  properties: {
    [K in keyof T]: Schema<T[K], R, T>;
  };
  validationFn?: ValidationFn<T, R, P>;
};
