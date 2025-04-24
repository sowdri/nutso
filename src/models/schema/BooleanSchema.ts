import { BaseSchema } from "./BaseSchema";

export type BooleanSchema = BaseSchema<boolean> & {
  type: "boolean";
};
