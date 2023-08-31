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

# Concept

The idea behind this library is to create a schema from a typescript type. The schema should reflect the structure of the type and should be in sync with it. If the type changes, the typescript compiler should force the schema to be updated, such that you get all the goodness of compile time typechecking for your schema files as well.

- Writing the `Schema` is super simple and there is just one 1 mandatory `type` information for each field.
- By default each field in the schema is `required`, if you want to make a field optional, then use the `optional: true` flag to mark it as optional.

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
      "errorPath": []
    },
    "dob": {
      "isValid": true,
      "errorMessage": "",
      "errorPath": []
    },
    "height": {
      "isValid": true,
      "errorMessage": "",
      "errorPath": []
    }
  },
  "fieldPath": []
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

# Validators

## Common Fields

The following fields are applicable for all data types.

| name     | type      | default | description                                               |
| -------- | --------- | ------- | --------------------------------------------------------- |
| type     | `string`  | -       | The value of this has to match the data type of the field |
| optional | `boolean` | false   | Specify if the field is optional                          |

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

No other validators are present for date at the moment, it is WIP. Please create an issue if you need specific validators for `date`.

## Array validators

The following validators are applicable for `Array` data type.

| name     | type          | default | description                                       |
| -------- | ------------- | ------- | ------------------------------------------------- |
| type     | `string`      | -       | The value of this has to be `array`               |
| minItems | `number`      | -       | The minimun number of items required in the array |
| maxItems | `number`      | -       | The maximum number of items allowed in the array  |
| items    | `Schema<T,R>` | -       | The schema of the item present in the array       |

Example:

```typescript
type Colors = string[];
const favColors: Colors = ["blue", "green", "black"];
const colorsSchema: Schema<Colors> = {
  type: "array",
  minItems: 3,
  maxItems: 10,
  items: {
    type: "string",
    minLength: 5, // blue will fail
  },
};
```

# Validation Function

This is arguably the most powerful feature of `nutso`. The could solve any of your validation requirements with ease.

```typescript
export type ValidationFn<T, R> = (field: T, root: R) => ValidatorFnResult | void;
```

Right now validation function is supported only for the following types, but it will be soon supported on all types.

- string
- number
- date

# Applications

- Nutso can be used in the UI for form validation and the error messages could be displayed to the users using static typesafe access to the error message.
- Can aso be used on the server to validate incoming objects against the schema.

> You can defind the schema along side your models and use it both on the client and server.

# Notes

- Follows JSON Schema terminology whereever possible [https://json-schema.org/specification.html]

# TODO

- Tuple support
- Object valiation with circular reference
- Custom validation function for other data types
