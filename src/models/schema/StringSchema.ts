import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { Schema } from "./Schema";
import { BaseSchema } from "./BaseSchema";

/*
type ValidatorFnResult1 = {
  errorMessage: string;
};

type ValidationFn1<T, R, P> = (args: { value: T; parent: P; root: R }) => ValidatorFnResult1 | void;

*/
export type StringSchema<R = string, P = unknown> = BaseSchema<string, R, P> & {
  type: "string";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  values?: string[];
};
