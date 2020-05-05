import { Schema } from "./Schema";
import { OptionalFlag } from "../OptionalFlag";
// import { BaseSchema } from "./BaseSchema";

export type ObjectSchema<T, R> = {
  type: "object";
  optional?: OptionalFlag<R>;
  properties: {
    [P in keyof T]: Schema<T[P], R>;
  };
};
