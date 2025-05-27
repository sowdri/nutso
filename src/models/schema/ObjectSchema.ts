import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";

export type ObjectSchema<T> = BaseSchema<T> & {
  type: "object";
  minProperties?: number;
  maxProperties?: number;
  properties: {
    [K in keyof T]-?: Schema<T[K]>;
  };
};
