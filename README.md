# nutso 🦸🏼‍♂️

[![Build Status](https://travis-ci.com/sowdri/nutso.svg?branch=master)](https://travis-ci.com/sowdri/nutso)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](http://img.shields.io/npm/v/nutso.svg?style=flat)](https://npmjs.org/package/nutso "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A typesafe validation library for typescript!

> Both `Schema` and `Result` are typesafe! So it's basically `Schema<T>` and `Result<T>` 🦸🏼‍♂️

# Objective

- Typesafe
- Simple
- Clean
- Unambigious
- Fast

# Concept

The idea behind this library is to create a schema from a typescript type. The schema should reflect the structure of the type and should be in sync with it. If the type changes the schema should be updated to reflect it.

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

Schema is the validation definition you write for the type T. It is typesafe, so it's super easy to write the schema as the IDE will guide you though the definition for every field. You will literally feel like magic defining schemas. And each time you update `T`, you will get compiler errors to notify of potential issues with your schema.

- `type` is the only required information for each field. Because nutso uses type inference, the `type` field can only be the type of the field. So you can't go wrong here.
- Optional fields in T are optional in schema as well.

```typescript
const customerSchema: Schema<Customer> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24
    },
    dob: {
      type: "date"
    },
    height: {
      type: "number",
      min: 0.1,
      max: 7.5
    }
  }
};
```

# Result < T >

The result returned by `nutso` is also typesafe, meaning you will be able to access the validation result and the `errorMessage` in a type-safe way.

```typescript
const customer: Customer = {
  name: "John Appleseed",
  dob: new Date(), // just born
  height: 3.2
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

The beauty of the `Result<T>` is the fact that it's typesafe as well.

So you could access the validation result using the following notation:

```typescript
const result: Result<Customer> = validate(customer, customerSchema);

result.isValid;
result.properties.name.isValid;
result.properties.age.isValid;
result.properties.height.errorMessage;
```

# Applications

- Nutso can be used in the UI for form validation and the error messages could be displayed to the users using static typesafe access to the error message.
- Can aso be used on the server to validate incoming objects against the schema.

> You can defind the schema along side your models and use it both on the client and server.

# Notes

- Follows JSON Schema terminology whereever possible [https://json-schema.org/specification.html]

# TODO

- Tuple support
- Object valiation with circular reference
- Custom validation function
