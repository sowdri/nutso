import { BaseSchema } from "./BaseSchema";

export type NumberSchema = BaseSchema & {
  min: number;
  max: number;
};
