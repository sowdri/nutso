import { Schema } from "./Schema";
import { OptionalFlag } from "../OptionalFlag";

export type ObjectSchema<T, R = T, P = unknown> = {
  type: "object";
  optional?: OptionalFlag<R, P>;
  properties: {
    [K in keyof T]: Schema<T[K], R, T>;
  };
};
