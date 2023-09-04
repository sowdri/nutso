import { ObjectSchema } from "../models/schema/ObjectSchema";
import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";
import { validateObject, isRegex, getRegex } from "../validate/validateObject";

test(`isRegex`, () => {
  const test = isRegex("/.*/");
  expect(test).toBe(true);
});

test(`getRegex`, () => {
  const regex = getRegex("/.*/");
  expect(regex.test("foo")).toBe(true);
});

test(`Basic`, () => {
  type Customer = {
    name: "";
  };

  const obj: Customer = { name: "" };
  const schema: ObjectSchema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
      },
    },
  };

  const result1 = validateObject({ value: obj, root: obj, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(obj, schema);
  expect(result2.isValid).toBe(false);
});

test(`Address is optional in schema and undefined in object`, () => {
  type Customer = {
    name: string;
    address?: {
      city: string;
    };
  };

  const obj: Customer = { name: "John" };
  const schema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
      },
      address: {
        type: "object",
        optional: true,
        properties: {
          city: {
            type: "string",
          },
        },
      },
    },
  };

  const result = validate(obj, schema);
  expect(result).toMatchSnapshot();
});

test(`Validate object - validation function`, () => {
  type Customer = {
    username: string;
    password: string;
    confirmPassword: string;
  };

  const obj: Customer = { username: "john@example.com", password: "123", confirmPassword: "1234" };
  const schema: Schema<Customer> = {
    type: "object",
    properties: {
      username: {
        type: "string",
        minLength: 3,
      },
      password: {
        type: "string",
        minLength: 3,
      },
      confirmPassword: {
        type: "string",
        minLength: 3,
      },
    },
    validationFn: (args) => {
      // check if passwords match
      if (args.value.password == args.value.confirmPassword) return;
      return {
        errorMessage: "Passwords do not match ",
      };
    },
  };

  const result = validate(obj, schema);
  expect(result).toMatchInlineSnapshot(`
{
  "errorMessage": "Passwords do not match ",
  "errorPath": [],
  "isValid": false,
  "properties": {
    "confirmPassword": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
    "password": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
    "username": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
  },
}
`);
});

test(`Validate object - validation function only called if other validations pass`, () => {
  type Customer = {
    username: string;
    password: string;
    confirmPassword: string;
  };

  const obj: Customer = { username: "john@example.com", password: "12", confirmPassword: "1234" };
  const schema: Schema<Customer> = {
    type: "object",
    properties: {
      username: {
        type: "string",
        minLength: 3,
      },
      password: {
        type: "string",
        minLength: 3,
      },
      confirmPassword: {
        type: "string",
        minLength: 3,
      },
    },
    validationFn: (args) => {
      // check if passwords match
      if (args.value.password == args.value.confirmPassword) return;
      return {
        errorMessage: "Passwords do not match ",
      };
    },
  };

  const result = validate(obj, schema);
  expect(result).toMatchInlineSnapshot(`
{
  "errorMessage": "Should be at least 3 characters.",
  "errorPath": [
    "password",
  ],
  "isValid": false,
  "properties": {
    "confirmPassword": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
    "password": {
      "errorMessage": "Should be at least 3 characters.",
      "errorPath": [],
      "isValid": false,
    },
    "username": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
  },
}
`);
});
