import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";

export type ObjectSchema<T> = BaseSchema & {
  type: "object";
  properties: {
    [P in keyof T]: Schema<T[P]>;
  };
};
