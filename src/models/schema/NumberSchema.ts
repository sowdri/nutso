import { BaseSchema } from "./BaseSchema";

export type NumberSchema = BaseSchema & {
  type: "number";
  min?: number;
  max?: number;
};
