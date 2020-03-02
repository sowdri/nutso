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
        validatorFn: (value, root) => {
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
        validatorFn: (value, root) => {
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
        validatorFn: (value, root) => {
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
        validatorFn: (value, root) => {
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

  const result = validate(customer, customer, customerSchema);
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
        validatorFn: (value, root) => {
          root.address.line1;
          return {
            isValid: false,
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
        validatorFn: (value, root) => {
          return {
            isValid: true,
            errorMessage: ""
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

  const result = validate(customer, customer, customerSchema);
  expect(result).toMatchSnapshot();
});
