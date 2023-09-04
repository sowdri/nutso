import { Schema, validate } from "..";

test(`Login form validation - at password level`, () => {
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
  expect(result).toMatchInlineSnapshot(`
{
  "errorMessage": "Passwords do not match",
  "errorPath": [
    "repeatPassword",
  ],
  "isValid": false,
  "properties": {
    "password": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
    "repeatPassword": {
      "errorMessage": "Passwords do not match",
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

/**
 * The above validation is better done at the parent level
 */
test(`Login form validation - at parent level`, () => {
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
        pattern: /\w{6}/,
      },
    },
    validationFn: (args) => {
      const form = args.value;
      if (form.password !== form.repeatPassword)
        return {
          errorMessage: "Passwords do not match",
        };
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
  "errorPath": [],
  "isValid": false,
  "properties": {
    "password": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
    "repeatPassword": {
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
