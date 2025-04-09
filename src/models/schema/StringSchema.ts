import { OptionalFlag } from "../OptionalFlag";
import { ValidationFn } from "../ValidationFn";
import { Schema } from "./Schema";

/*
type ValidatorFnResult1 = {
  errorMessage: string;
};

type ValidationFn1<T, R, P> = (args: { value: T; parent: P; root: R }) => ValidatorFnResult1 | void;

*/
export type StringSchema<R = string, P = unknown> = {
  type: "string";
  optional?: OptionalFlag<R, P>;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  values?: string[];
  validationFn?: ValidationFn<string, R, P>;
};
