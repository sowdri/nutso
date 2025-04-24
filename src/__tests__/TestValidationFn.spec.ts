import { Schema } from "..";
import { validate } from "../validate/validate";

test(`Custom validation - check errorPath - level 1`, () => {
  type Address = {
    line1: string;
  };
  type Customer = {
    name: string;
    address: Address;
  };

  const addressSchema: Schema<Address> = {
    type: "object",
    properties: {
      line1: {
        type: "string",
        validationFn: (args) => {
          (args.parent as Address).line1;
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

  const addressSchema: Schema<Address> = {
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

test(`Login form validation`, () => {
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
          if (args.value !== (args.parent as LoginForm).password)
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
  expect(result).toMatchInlineSnapshot(`
{
  "errorMessage": "Passwords do not match",
  "errorPath": [
    "repeatPassword",
  ],
  "isValid": false,
  "properties": {
    "password": {
      "isValid": true,
    },
    "repeatPassword": {
      "errorMessage": "Passwords do not match",
      "errorPath": [
        "repeatPassword",
      ],
      "isValid": false,
    },
    "username": {
      "isValid": true,
    },
  },
}
`);
});
