import { Schema } from "..";
import { _validate } from "../validate/validate";

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
        validationFn: (value, root) => {
          root.address.line1;
          return {
            isValid: true,
            errorMessage: ""
          };
        }
      }
    }
  };

  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        validationFn: (value, root) => {
          return {
            isValid: false,
            errorMessage: "Custom validation failed"
          };
        }
      },
      address: addressSchema
    }
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
        validationFn: (value, root) => {
          root.address.line1;
        }
      }
    }
  };

  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        validationFn: (value, root) => {
          return {
            isValid: false,
            errorMessage: "Custom validation failed"
          };
        }
      },
      address: addressSchema
    }
  };

  const customer: Customer = {
    name: "John",
    address: {
      line1: "10 Downing St"
    }
  };

  const result = _validate(customer, customer, customerSchema);
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
        validationFn: (value, root) => {
          return {
            errorMessage: "Custom validation failed"
          };
        }
      }
    }
  };

  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        validationFn: (value, root) => {}
      },
      address: addressSchema
    }
  };

  const customer: Customer = {
    name: "John",
    address: {
      line1: "10 Downing St"
    }
  };

  const result = _validate(customer, customer, customerSchema);
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
        type: "string"
      },
      password: {
        type: "string",
        pattern: /\w{6}/
      },
      repeatPassword: {
        type: "string",
        validationFn: (field, root) => {
          if (field !== root.password)
            return {
              errorMessage: "Passwords do not match"
            };
        }
      }
    }
  };

  const form1: LoginForm = {
    username: "John",
    password: "foobarbaz",
    repeatPassword: "foofoofoo"
  };
  const result = _validate(form1, form1, loginSchema);
  expect(result).toMatchSnapshot();
});
