import { BaseSchema } from "./BaseSchema";

export type StringSchema = BaseSchema & {
  type: "string";
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
};
