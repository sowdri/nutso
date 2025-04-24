# nutso 🦸🏼‍♂️

[![Build Status](https://travis-ci.com/sowdri/nutso.svg?branch=master)](https://travis-ci.com/sowdri/nutso)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/nutso.svg?style=flat)](https://npmjs.org/package/nutso "View this project on npm")
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A typesafe validation library for typescript!

> Both `Schema` and `Result` are typesafe! So it's basically `Schema<T>` and `Result<T>` 🦸🏼‍♂️

# Objective

- Typesafe
- Zero dependencies
- Super Fast
- Run everywhere (browser & nodejs)
- Flexible validation rules including conditional validation

# Concept

The idea behind this library is to create a schema from a typescript type. The schema should reflect the structure of the type and should be in sync with it. If the type changes, the typescript compiler should force the schema to be updated, such that you get all the goodness of compile time typechecking for your schema files as well.

- Writing the `Schema` is super simple and there is just one 1 mandatory `type` information for each field.
- By default each field in the schema is `required`, if you want to make a field optional, then use the `optional: true` flag to mark it as optional.
- For conditional validation where fields should only be validated in certain contexts (like discriminated union types or multi-step forms), use the `isApplicableFn` to dynamically determine if a field should be validated.

```typescript
{
  type: "number" | "string" | "date" | "boolean" | "array" | "object";
}
```

# T

T is the type defined in typescript

```typescript
// type or interface or class
type Customer = {
  name: string;
  dob: Date;
  height: number;
};
```

# Schema < T >

Schema is the validation definition you write for the type T. It is typesafe, so it's super easy to write the schema as the IDE will guide you though the definition for every field. You will literally feel like magic defining the schema. And each time you update `T`, you will get compiler errors to notify of potential issues with your schema.

- `type` is the only required information for each field. Because nutso uses type inference, the `type` field can only be the type of the field. So you can't go wrong here.

> Optional fields in T are optional in schema as well.

```typescript
const customerSchema: Schema<Customer> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24,
    },
    dob: {
      type: "date",
    },
    height: {
      type: "number",
      min: 0.1,
      max: 7.5,
    },
  },
};
```

# Result < T >

The result returned by `nutso` is also typesafe, meaning you will be able to access the validation result and the `errorMessage` in a type-safe way. You will feel absolutely in control when using the validation result. And again, because it's typesafe as well, when you update the schema, typescript will help you to fix your result where ever you have used it. voila!

```typescript
const customer: Customer = {
  name: "John Appleseed",
  dob: new Date(), // just born
  height: 3.2,
};

const result: Result<Customer> = validate(customer, customerSchema);
console.log(JSON.stringify(result, null, 2));
```

The above validation will produce the following output:

```json
{
  "isValid": true,
  "errorMessage": "",
  "properties": {
    "name": {
      "isValid": true,
      "errorMessage": "",
      "errorPath": ["name"]
    },
    "dob": {
      "isValid": true,
      "errorMessage": "",
      "errorPath": ["dob"]
    },
    "height": {
      "isValid": true,
      "errorMessage": "",
      "errorPath": ["height"]
    }
  },
  "errorPath": []
}
```

> The beauty of the `Result<T>` is the fact that it's typesafe as well.

So you could access the validation result using the following notation:

```typescript
const result: Result<Customer> = validate(customer, customerSchema);

result.isValid;
result.properties.name.isValid;
result.properties.age.isValid;
result.properties.height.errorMessage;
```

## Error Paths

When validation errors occur, `nutso` provides precise error paths that indicate exactly where in the object structure the error occurred. The `errorPath` property is an array of strings that represents the path to the error:

```typescript
// For a nested object structure
const user = {
  name: "John",
  address: {
    street: "123 Main St",
    city: "", // Invalid - empty string
  },
};

const result = validate(user, userSchema);
console.log(result.errorPath); // ["address", "city"]
```

For arrays, the index is included in the path as a string:

```typescript
const todoList = {
  tasks: [
    { title: "Task 1", completed: false },
    { title: "", completed: false }, // Invalid - empty title
  ],
};

const result = validate(todoList, todoListSchema);
console.log(result.errorPath); // ["tasks", "1", "title"]
```

This feature is particularly useful for:

- Form validation in UIs - direct users to the specific field that needs attention
- API validation - provide precise error locations in responses
- Complex validation scenarios - easily identify which part of a deeply nested structure failed validation

# Validators

## Common Fields

The following fields are applicable for all data types.

| name           | type                  | default | description                                               |
| -------------- | --------------------- | ------- | --------------------------------------------------------- |
| type           | `string`              | -       | The value of this has to match the data type of the field |
| optional       | `boolean \| function` | false   | Specify if the field is optional                          |
| isApplicableFn | `function`            | -       | Dynamic function to determine if a field is applicable    |

When an object is marked as optional in the `Schema` and if it's `undefined`, then the object is `valid`, so the `Result` will not have the `properties` field populated for those fields.

### isApplicableFn

The `isApplicableFn` takes a function that determines at runtime whether a field should be validated or not. This is different from `optional` which marks a field as always optional. The `isApplicableFn` allows for dynamic determination based on the values of the parent or root object.

```typescript
isApplicableFn: ({ value, parent, root }) => boolean;
```

- `value`: The current value being validated
- `parent`: The parent object containing this value
- `root`: The root object of the schema (the entire object being validated). By default, it's set to `unknown` for better composability. When you need type safety for root access, explicitly provide the root type when defining your schema.

If the function returns `false`, the field is considered valid regardless of its actual value and no further validation is performed.

#### Basic Example

```typescript
type User = {
  type: "user" | "admin";
  username: string;
  adminCode?: string;
};

const userSchema: Schema<User> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      values: ["user", "admin"],
      w,
    },
    username: {
      type: "string",
      minLength: 3,
    },
    adminCode: {
      type: "string",
      minLength: 8,
      // Only validate adminCode if the user type is 'admin'
      isApplicableFn: ({ parent }) => parent.type === "admin",
    },
  },
};

// For admin users, adminCode will be validated
const adminUser = { type: "admin", username: "admin1", adminCode: "12345" };
const adminResult = validate(adminUser, userSchema);
// adminResult.isValid will be false if adminCode is less than 8 chars

// For regular users, adminCode won't be validated even if present
const regularUser = { type: "user", username: "user1", adminCode: "12345" };
const userResult = validate(regularUser, userSchema);
// userResult.isValid will be true regardless of adminCode's value
```

### Discriminated Unions

When working with discriminated unions in TypeScript, Nutso allows you to validate them effectively:

```typescript
// Define the types for our shape union
type Circle = {
  type: "circle";
  radius: number;
};

type Rectangle = {
  type: "rectangle";
  width: number;
  height: number;
};

type Triangle = {
  type: "triangle";
  base: number;
  height: number;
};

// Define our Shape union type
type Shape = Circle | Rectangle | Triangle;

// Define the schema for our Shape union
const shapeSchema: Schema<Shape> = {
  type: "object",
  properties: {
    // Common discriminator field
    type: { type: "string", values: ["circle", "rectangle", "triangle"] },

    // Circle-specific property
    radius: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) => parent.type === "circle",
    },

    // Rectangle-specific properties
    width: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) => parent.type === "rectangle",
    },
    height: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) =>
        parent.type === "rectangle" || parent.type === "triangle",
    },

    // Triangle-specific properties
    base: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) => parent.type === "triangle",
    },
  },
};

const circle: Shape = { type: "circle", radius: 5 };
const result = validate(circle, shapeSchema);
```

For a complete working example with test cases, see [TestDiscriminatedUnionSimple.spec.ts](https://github.com/sowdri/nutso/blob/master/src/__tests__/TestDiscriminatedUnionSimple.spec.ts).

# Multi-Step Forms

Another practical use case is validating multi-step forms where certain fields should only be validated at specific stages:

```typescript
type Form = {
  stage: number;
  personalInfo: {
    name: string;
    email: string;
  };
  paymentInfo: {
    cardNumber: string;
    billingAddress: string;
  };
};

const formSchema: Schema<Form> = {
  type: "object",
  properties: {
    stage: {
      type: "number",
      min: 1,
      max: 2,
    },
    personalInfo: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
      },
    },
    paymentInfo: {
      type: "object",
      // Only validate payment info at stage 2
      isApplicableFn: ({ root }) => root.stage === 2,
      properties: {
        cardNumber: { type: "string" },
        billingAddress: { type: "string" },
      },
    },
  },
};
```

When an object is marked as optional in the `Schema` and if it's `undefined`, then the object is `valid`, so the `Result` will not have the `properties` field populated for those fields.

Look at the following example:

```typescript
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

const result = vaildate(obj, schema);

result.properties.address.isValid === true;
result.properties.address.properties === {}; // is empty
```

## String validators

The following validators are applicable for `string` data type.

| name         | type       | default | description                                  |
| ------------ | ---------- | ------- | -------------------------------------------- |
| type         | `string`   | -       | The value of this has to be 'string'         |
| minLength    | `number`   | -       | Minimum length of the string                 |
| maxLength    | `number`   | -       | Maximum length of the string                 |
| pattern      | `regex`    | -       | A valid js regex to match against the string |
| values       | `string[]` | -       | List of possible values the string can take  |
| value        | `string`   | -       | Exact value the string must match            |
| validationFn | `function` | -       | [Validation Function](#validation-function)  |

## Number validators

The following validators are applicable for `number` data type.

| name         | type       | default | description                                  |
| ------------ | ---------- | ------- | -------------------------------------------- |
| type         | `string`   | -       | The value of this has to be 'number'         |
| min          | `number`   | -       | Minimum allowed value of the number          |
| max          | `number`   | -       | Maximum allowed value of the number          |
| pattern      | `regex`    | -       | A valid js regex to match against the number |
| validationFn | `function` | -       | [Validation Function](#validation-function)  |

## Date validators

The following validators are applicable for `Date` data type.

| name         | type       | default | description                                 |
| ------------ | ---------- | ------- | ------------------------------------------- |
| type         | `string`   | -       | The value of this has to be `date`          |
| validationFn | `function` | -       | [Validation Function](#validation-function) |

No other validators are present for date at the moment, it is WIP. Please create an issue if you need specific validators for `date`.

## Boolean validators

The following validators are applicable for `Boolean` data type.

| name         | type       | default | description                                 |
| ------------ | ---------- | ------- | ------------------------------------------- |
| type         | `string`   | -       | The value of this has to be `boolean`       |
| validationFn | `function` | -       | [Validation Function](#validation-function) |

No other validators are present for boolean at the moment, it is WIP. Please create an issue if you need specific validators for `boolean`.

## Array validators

// ... existing code ...
