import { Schema, validate } from "..";

test(`Validate object - check error path - 2 levels deep`, () => {
  type Credential = {
    username: string;
    password: string;
    confirmPassword: string;
  };
  type Customer = {
    name: string;
    credential: Credential;
  };

  const credential: Credential = { username: "john@example.com", password: "12", confirmPassword: "1234" };
  const customer: Customer = { name: "John Smith", credential };

  const schema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      credential: {
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
      },
    },
  };

  const result = validate(customer, schema);
  expect(result.errorPath).toMatchInlineSnapshot(`
[
  "credential",
  "password",
]
`);
});

test(`Validate object - check error path - 1 level deep`, () => {
  type Credential = {
    username: string;
    password: string;
    confirmPassword: string;
  };
  type Customer = {
    name: string;
    credential: Credential;
  };

  const credential: Credential = { username: "john@example.com", password: "123", confirmPassword: "1234" };
  const customer: Customer = { name: "John Smith", credential };

  const schema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      credential: {
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
      },
    },
  };

  const result = validate(customer, schema);
  expect(result.errorPath).toMatchInlineSnapshot(`
[
  "credential",
]
`);
});
