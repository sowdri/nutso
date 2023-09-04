import { Schema } from "..";
import { validate } from "../validate/validate";

test(`Compose schema with different roots - typesafety`, () => {
  type Address = {
    line1: string;
  };
  type Customer = {
    name: string;
    address: Address;
  };

  const addressSchema: Schema<Address, Customer> = {
    type: "object",
    properties: {
      line1: {
        type: "string",
        validationFn: (args) => {
          args.parent.line1;
          return {
            isValid: true,
            errorMessage: "",
          };
        },
      },
    },
  };

  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        validationFn: (args) => {
          return {
            isValid: false,
            errorMessage: "Custom validation failed",
          };
        },
      },
      address: addressSchema,
    },
  };

  // this test is just to ensure typescript is not complaining!
  // so no assertion required
  expect(true).toBeTruthy();
});

test(`Custom validation - check errorPath - level 1`, () => {
  type Address = {
    line1: string;
  };
  type Customer = {
    name: string;
    address: Address;
  };

  const addressSchema: Schema<Address, Customer> = {
    type: "object",
    properties: {
      line1: {
        type: "string",
        validationFn: (args) => {
          args.parent.line1;
        },
      },
    },
  };

  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        validationFn: (args) => {
          return {
            isValid: false,
            errorMessage: "Custom validation failed",
          };
        },
      },
      address: addressSchema,
    },
  };

  const customer: Customer = {
    name: "John",
    address: {
      line1: "10 Downing St",
    },
  };

  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});

test(`Custom validation - check errorPath - level 2`, () => {
  type Address = {
    line1: string;
  };
  type Customer = {
    name: string;
    address: Address;
  };

  const addressSchema: Schema<Address, Customer> = {
    type: "object",
    properties: {
      line1: {
        type: "string",
        validationFn: (args) => {
          return {
            errorMessage: "Custom validation failed",
          };
        },
      },
    },
  };

  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        validationFn: (args) => {},
      },
      address: addressSchema,
    },
  };

  const customer: Customer = {
    name: "John",
    address: {
      line1: "10 Downing St",
    },
  };

  const result = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});

test(`Password equality validation`, () => {
  type LoginForm = {
    username: string;
    password: string;
    repeatPassword: string;
  };

  const loginSchema: Schema<LoginForm> = {
    type: "object",
    properties: {
      username: {
        type: "string",
      },
      password: {
        type: "string",
        pattern: /\w{6}/,
      },
      repeatPassword: {
        type: "string",
        validationFn: (args) => {
          if (args.value !== args.parent.password)
            return {
              errorMessage: "Passwords do not match",
            };
        },
      },
    },
  };

  const form1: LoginForm = {
    username: "John",
    password: "foobarbaz",
    repeatPassword: "foofoofoo",
  };
  const result = validate(form1, loginSchema);
  expect(result).toMatchSnapshot();
});
