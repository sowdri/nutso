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
  validationFn?: ValidationFn<string, R, P>;
};

const nakedSchema: Schema<string> = {
  type: "string",
  validationFn: (args) => {},
};

type Customer = {
  name: string;
};

const schema: Schema<Customer> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      validationFn: (args) => {},
    },
  },
};

type Bar = {
  bar: string;
};

type Foo = {
  bar: Bar;
};

const fooSchema: Schema<Foo> = {
  type: "object",
  properties: {
    bar: {
      type: "object",
      properties: {
        bar: {
          type: "string",
          validationFn: (args) => {},
        },
      },
    },
  },
};
