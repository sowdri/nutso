import { Schema } from "./Schema";

export type ObjectSchema<T> = { __required: boolean } & {
  [P in keyof T]: Schema<T[P]>;
};
