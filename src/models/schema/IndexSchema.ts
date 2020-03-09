import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";

export type IndexSchema<T, R> = BaseSchema & {
  type: "index";
  key: Schema<keyof T, R>;
  value: Schema<T[keyof T], R>;
};

// export type IndexSchema<T, R> = T extends { [key: string]: infer V }
//   ? BaseSchema & {
//       type: "index";
//       key: Schema<string, R>;
//       value: Schema<V, R>;
//     }
//   : never;
