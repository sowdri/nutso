import { BaseSchema } from "./BaseSchema";
import { IndexSchema } from "./IndexSchema";
import { Schema } from "./Schema";

export type StaticSchema<T, R> = BaseSchema & {
  type: "object";
  properties: {
    [P in keyof T]: Schema<T[P], R>;
  };
};

export type ObjectSchema<T, R> = StaticSchema<T, R> | IndexSchema<T, R>;
