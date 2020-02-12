import { BaseSchema } from "./BaseSchema";

export type StringSchema = BaseSchema & {
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
};
