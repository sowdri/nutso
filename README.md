# nutso 🦸🏼‍♂️

[![Build Status](https://travis-ci.com/sowdri/nutso.svg?branch=master)](https://travis-ci.com/sowdri/nutso)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](http://img.shields.io/npm/v/nutso.svg?style=flat)](https://npmjs.org/package/nutso "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A typesafe validation library for typescript

# Objective

- Typesafe
- Simple
- Clean
- Unambigious
- Fast

# Concept

The idea behind this library is to create a schema from a typescript type. The schema should reflect the structure of the type and should be in sync with it. If the type changes the schema should be updated to reflect it.

Writing the `Schema` is super simple and there is just one 1 mandatory information for each field:

```
{
  type: 'number' | 'string' | 'date' | 'boolean' | 'array' | 'object'
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
```
