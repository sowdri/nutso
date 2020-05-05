import { Schema } from "./Schema";
import { OptionalFlag } from "../OptionalFlag";

export type ObjectSchema<T, P = unknown> = {
  type: "object";
  optional?: OptionalFlag<P>;
  properties: {
    [K in keyof T]: Schema<T[K], T>;
  };
};
