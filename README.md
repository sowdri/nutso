# nutso 🦸🏼‍♂️

[![Build Status](https://travis-ci.com/sowdri/nutso.svg?branch=master)](https://travis-ci.com/sowdri/nutso)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm version](https://img.shields.io/npm/v/nutso.svg?style=flat)](https://npmjs.org/package/nutso "View this project on npm")
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A typesafe schema validation library for TypeScript!

> Both `Schema` and `Result` are typesafe! So it's basically `Schema<T>` and `Result<T>` 🦸🏼‍♂️

## Table of Contents

- [Objective](#objective)
- [Concept](#concept)
- [Schema](#schema)
  - [Basic Schema Structure](#basic-schema-structure)
  - [Defining TypeScript Types](#defining-typescript-types)
  - [Writing Schema Definitions](#writing-schema-definitions)
  - [Handling Optional Fields](#handling-optional-fields)
- [Validators](#validators)
  - [Common Fields](#common-fields)
  - [String Validators](#string-validators)
  - [Number Validators](#number-validators)
  - [Date Validators](#date-validators)
  - [Boolean Validators](#boolean-validators)
  - [Array Validators](#array-validators)
  - [Object Validators](#object-validators)
- [Advanced Concepts](#advanced-concepts)
  - [ValidationFn](#validationfn)
  - [IsApplicableFn](#isapplicablefn)
  - [OptionalFlag](#optionalflag)
  - [Type Safety with Unknown Parameters](#type-safety-with-unknown-parameters)
  - [Discriminated Unions](#discriminated-unions)
  - [Multi-Step Forms](#multi-step-forms)
- [Validation Process & Results](#validation-process--results)
  - [How Validation Works](#how-validation-works)
  - [Result Structure](#result-structure)
  - [Type Guards for Results](#type-guards-for-results)
  - [Error Paths](#error-paths)
- [Contributing](#contributing)
- [License](#license)

# Objective

- Typesafe
- Zero dependencies
- Super Fast
- Run everywhere (browser & nodejs)
- Flexible validation rules including conditional validation

# Concept

The idea behind this library is to create a schema from a TypeScript type. The schema should reflect the structure of the type and should be in sync with it. If the type changes, the TypeScript compiler should force the schema to be updated, such that you get all the goodness of compile-time typechecking for your schema files as well.

- Writing the `Schema` is super simple and there is just one mandatory `type` information for each field.
- By default each field in the schema is `required`, if you want to make a field optional, then use the `optional: true` flag to mark it as optional.
- For conditional validation where fields should only be validated in certain contexts (like discriminated union types or multi-step forms), use the `isApplicableFn` to dynamically determine if a field should be validated.

```typescript
{
  type: "number" | "string" | "date" | "boolean" | "array" | "object";
}
```

# Schema

## Basic Schema Structure

The library uses TypeScript to define type-safe schema models for different data types:

- Each schema type (Number, String, Boolean, Array, Object, Date) extends a BaseSchema
- Schemas can include validation rules specific to their type
- Schema types are simplified to `Schema<T>` where T is the type being validated

## Defining TypeScript Types

T is the type defined in TypeScript that you want to validate:

```typescript
// type or interface or class
type Customer = {
  name: string;
  dob: Date;
  height: number;
};
```

## Writing Schema Definitions

Schema is the validation definition you write for the type T. It is typesafe, so it's super easy to write the schema as the IDE will guide you through the definition for every field. You will literally feel like magic defining the schema. And each time you update `T`, you will get compiler errors to notify of potential issues with your schema.

- `type` is the only required information for each field. Because nutso uses type inference, the `type` field can only be the type of the field. So you can't go wrong here.

> **Important**: All fields in the TypeScript type T must be defined in the schema properties, including optional fields. Optional fields in TypeScript are required in the schema definition but can be marked as optional using the `optional` flag.

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

## Handling Optional Fields

Even if a field is optional in your TypeScript type (marked with `?`), you must still define it in the schema's `properties`. Use the `optional` flag to indicate that the field can be undefined:

```typescript
type User = {
  name: string;
  email?: string; // Optional in TypeScript
  age?: number;   // Optional in TypeScript
};

const userSchema: Schema<User> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    email: {
      type: "string",
      optional: true, // Mark as optional in schema
    },
    age: {
      type: "number",
      optional: true, // Mark as optional in schema
      min: 0,
    },
  },
};
```

The `optional` flag can also be a function for dynamic determination:

```typescript
type ConditionalUser = {
  isAdmin: boolean;
  adminCode?: string;
};

const conditionalUserSchema: Schema<ConditionalUser> = {
  type: "object",
  properties: {
    isAdmin: {
      type: "boolean",
    },
    adminCode: {
      type: "string",
      // Only required if user is admin
      optional: ({ root }) => !(root as ConditionalUser).isAdmin,
    },
  },
};
```

# Validators

## Common Fields

The following fields are applicable for all data types:

| name           | type                  | default | description                                               |
| -------------- | --------------------- | ------- | --------------------------------------------------------- |
| type           | `string`              | -       | The value of this has to match the data type of the field |
| optional       | `boolean \| function` | false   | Specify if the field is optional                          |
| isApplicableFn | `function`            | -       | Dynamic function to determine if a field is applicable    |
| validationFn   | `function`            | -       | Custom validation function                                |

## String Validators

The following validators are applicable for `string` data type:

| name         | type       | default | description                                  |
| ------------ | ---------- | ------- | -------------------------------------------- |
| type         | `string`   | -       | The value of this has to be 'string'         |
| minLength    | `number`   | -       | Minimum length of the string                 |
| maxLength    | `number`   | -       | Maximum length of the string                 |
| pattern      | `regex`    | -       | A valid js regex to match against the string |
| values       | `string[]` | -       | List of possible values the string can take  |
| value        | `string`   | -       | Exact value the string must match            |
| validationFn | `function` | -       | [Validation Function](#validationfn)         |

> **Note**: Empty strings (`""`) are considered valid by default. To disallow empty strings, set `minLength: 1` in your schema.

## Number Validators

The following validators are applicable for `number` data type:

| name         | type       | default | description                                  |
| ------------ | ---------- | ------- | -------------------------------------------- |
| type         | `string`   | -       | The value of this has to be 'number'         |
| min          | `number`   | -       | Minimum allowed value of the number          |
| max          | `number`   | -       | Maximum allowed value of the number          |
| pattern      | `regex`    | -       | A valid js regex to match against the number |
| validationFn | `function` | -       | [Validation Function](#validationfn)         |

## Date Validators

The following validators are applicable for `Date` data type:

| name         | type       | default | description                          |
| ------------ | ---------- | ------- | ------------------------------------ |
| type         | `string`   | -       | The value of this has to be `date`   |
| validationFn | `function` | -       | [Validation Function](#validationfn) |

No other validators are present for date at the moment, it is WIP. Please create an issue if you need specific validators for `date`.

## Boolean Validators

The following validators are applicable for `Boolean` data type:

| name         | type       | default | description                           |
| ------------ | ---------- | ------- | ------------------------------------- |
| type         | `string`   | -       | The value of this has to be `boolean` |
| validationFn | `function` | -       | [Validation Function](#validationfn)  |

No other validators are present for boolean at the moment, it is WIP. Please create an issue if you need specific validators for `boolean`.

## Array Validators

The following validators are applicable for `array` data type:

| name         | type        | default | description                               |
| ------------ | ----------- | ------- | ----------------------------------------- |
| type         | `string`    | -       | The value of this has to be `array`       |
| minItems     | `number`    | -       | Minimum number of items required          |
| maxItems     | `number`    | -       | Maximum number of items allowed           |
| itemSchema   | `Schema<T>` | -       | Schema to validate each item in the array |
| validationFn | `function`  | -       | [Validation Function](#validationfn)      |

Array validation:
- Validates each array item against the `itemSchema`
- Supports min/max item constraints
- Returns detailed validation results per item

## Object Validators

The following validators are applicable for `object` data type:

| name          | type                     | default | description                                                             |
| ------------- | ------------------------ | ------- | ----------------------------------------------------------------------- |
| type          | `string`                 | -       | The value of this has to be `object`                                    |
| minProperties | `number`                 | -       | Minimum number of properties required (useful for dynamic objects/maps) |
| maxProperties | `number`                 | -       | Maximum number of properties allowed (useful for dynamic objects/maps)  |
| properties    | `Record<string, Schema>` | -       | Object containing schemas for each property (supports regex patterns)  |
| validationFn  | `function`               | -       | [Validation Function](#validationfn)                                    |

Object validation:
- Validates object properties against their schemas
- Supports regex patterns for property names by using regex strings as keys in `properties`
- Supports minimum and maximum property count validation with `minProperties` and `maxProperties`
- Tracks processed fields to avoid duplicate validation

### Regex Pattern Identification

For a property key to be considered a valid regex pattern, it must:
- Start with the `^` symbol
- End with the `$` symbol

For example:
- `"^.*$"` - matches any property name
- `"^[a-zA-Z][a-zA-Z0-9_]*$"` - matches property names starting with a letter followed by letters, numbers, or underscores
- `"^(?!reserved).*$"` - matches any property name except "reserved"

Any property key that doesn't follow this pattern will be treated as a literal property name.

### Object Property Count Validation

The `minProperties` and `maxProperties` validators are particularly useful for validating dynamic objects like `Record<string, T>` or objects with regex-based property patterns, where the number of properties is not fixed at compile time:

```typescript
// Example: Validating a dynamic configuration map
type ConfigMap = Record<string, string | number | boolean>;

const configMapSchema: Schema<ConfigMap> = {
  type: "object",
  minProperties: 1, // At least one configuration item required
  maxProperties: 10, // Limit to prevent excessive configurations
  properties: {
    // Use regex to match any property name
    "^.*$": {
      type: "string", // or union type for string | number | boolean
    },
  },
};

// Valid: 3 properties (within range)
const validConfig: ConfigMap = {
  host: "localhost",
  port: "3000",
  debug: "true",
};

// Invalid: Empty object (below minimum)
const invalidConfig: ConfigMap = {};
```

> **Note**: For regular objects with fixed properties defined at compile time, `minProperties` and `maxProperties` are typically not needed since TypeScript already enforces the structure. These validators shine when working with dynamic objects, maps, or objects with regex-based property patterns.

# Advanced Concepts

## ValidationFn

Function signature: `(args: { value: T; parent?: unknown; root: unknown }) => ValidatorFnResult | void`

- Developers must cast `parent` and `root` to their expected types before use
- Used for custom validation logic beyond the built-in validators
- The `parent` parameter will be undefined only for the root object; for all nested fields it will reference their containing object

Example:

```typescript
type Customer = {
  name: string;
  address: {
    street: string;
    city: string;
  };
};

const customerSchema = {
  type: "object",
  // At the Customer level, parent will be undefined since it's the root object
  validationFn: ({ value, parent, root }) => {
    // parent is undefined here
    // root is the Customer object (same as value in this case)
    const customer = value as Customer;
    // Custom validation logic
  },
  properties: {
    name: {
      type: "string",
      validationFn: ({ value, parent, root }) => {
        // parent is the Customer object, should be cast to Customer type
        const customerParent = parent as Customer;
        // root is still the Customer object (the top level object being validated)
        const customerRoot = root as Customer;
        // Custom validation for name field
      },
    },
    address: {
      type: "object",
      properties: {
        street: {
          type: "string",
          validationFn: ({ value, parent, root }) => {
            // parent is the address object, should be cast to Customer['address']
            const addressParent = parent as Customer["address"];
            // root is still the Customer object
            const customerRoot = root as Customer;
            // Custom validation for street field
          },
        },
      },
    },
  },
};
```

## IsApplicableFn

Function signature: `(args: { value: T; parent?: unknown; root: unknown }) => boolean`

- Determines if a field is applicable in the current context
- Useful for discriminated union types where certain fields should only be present for specific variants
- Requires explicit type casting of `parent` and `root` when implementing
- Like validationFn, `parent` will be undefined only for the root object

The `isApplicableFn` takes a function that determines at runtime whether a field should be validated or not. This is different from `optional` which marks a field as always optional. The `isApplicableFn` allows for dynamic determination based on the values of the parent or root object.

```typescript
isApplicableFn: ({ value, parent, root }) => boolean;
```

- `value`: The current value being validated
- `parent`: The parent object containing this value
- `root`: The root object of the schema (the entire object being validated). By default, it's set to `unknown` for better composability. When you need type safety for root access, explicitly provide the root type when defining your schema.

If the function returns `false`, the field is considered valid regardless of its actual value and no further validation is performed.

### Basic Example

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
    },
    username: {
      type: "string",
      minLength: 3,
    },
    adminCode: {
      type: "string",
      minLength: 8,
      // Only validate adminCode if the user type is 'admin'
      isApplicableFn: ({ parent }) => (parent as User).type === "admin",
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

## OptionalFlag

Can be a boolean or a function: `boolean | ((args: { root: unknown; parent?: unknown }) => boolean)`

- When using as a function, developers must cast `parent` and `root` to expected types
- Used to determine if a field can be undefined or null
- Similar to other functions, `parent` will be undefined only at the root level

## Type Safety with Unknown Parameters

The `validationFn`, `optionalFlagValidator` and `isApplicableFn` all use the `unknown` type for parent and root parameters:

- The `parent` parameter is only undefined for the root object being validated
- For all nested fields (properties within objects or items in arrays), `parent` will be defined
- The `unknown` type is used intentionally for better composability
- When implementing these functions, developers should properly type cast these parameters
- This design choice ensures type safety while providing flexibility

## Discriminated Unions

Discriminated unions are a powerful TypeScript pattern where objects share a common property (the discriminator) that determines which variant of the union the object represents. Nutso provides excellent support for validating discriminated unions using the `isApplicableFn` feature.

Nutso treats the complete object tree for validation schema purposes, and then specific fields can be conditionally validated depending on the type of the parent or root object. This approach allows you to define a comprehensive schema that covers all possible union variants while ensuring that only relevant fields are validated based on the discriminator value.

```typescript
// Define shape types
type Circle = { type: "circle"; radius: number };
type Rectangle = { type: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

// Method 1: Using Schema<T>
const shapeSchema: Schema<Shape> = {
  type: "object",
  properties: {
    type: { type: "string", values: ["circle", "rectangle"] },
    radius: {
      type: "number",
      isApplicableFn: ({ parent }) => (parent as Shape).type === "circle",
    },
    width: {
      type: "number",
      isApplicableFn: ({ parent }) => (parent as Shape).type === "rectangle",
    },
    height: {
      type: "number",
      isApplicableFn: ({ parent }) => (parent as Shape).type === "rectangle",
    },
  },
};
```

### More Complex Example

Here's a more comprehensive example with multiple union variants:

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
      isApplicableFn: ({ parent }) => (parent as Shape).type === "circle",
    },

    // Rectangle-specific properties
    width: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) => (parent as Shape).type === "rectangle",
    },
    height: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) =>
        (parent as Shape).type === "rectangle" || (parent as Shape).type === "triangle",
    },

    // Triangle-specific properties
    base: {
      type: "number",
      min: 0,
      isApplicableFn: ({ parent }) => (parent as Shape).type === "triangle",
    },
  },
};

const circle: Shape = { type: "circle", radius: 5 };
const result = validate(circle, shapeSchema);
```

For a complete working example with test cases, see [TestDiscriminatedUnionSimple.spec.ts](https://github.com/sowdri/nutso/blob/master/src/__tests__/TestDiscriminatedUnionSimple.spec.ts).

## Multi-Step Forms

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
      isApplicableFn: ({ root }) => (root as Form).stage === 2,
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

const result = validate(obj, schema);

result.properties.address.isValid === true;
result.properties.address.properties === {}; // is empty
```

# Validation Process & Results

## How Validation Works

The main entry point is the `validate` function which starts the validation process:

- Internally, it uses `_validate` to recursively validate data against schemas
- Type-specific validation functions handle the validation logic for each type
- The process includes type validation, conditional validation, optional field handling, nested validation for objects and arrays, and path tracking for precise error location

Key features:
- **Type Validation**: Ensures values match their expected types
- **Conditional Validation**: `isApplicableFn` determines if validation should be applied
- **Optional Fields**: Handled through the `optional` flag which can be boolean or function
- **Nested Validation**: For objects and arrays, validates nested properties recursively
- **Custom Validation**: `validationFn` allows custom validation logic
- **Path Tracking**: Keeps track of validation paths for precise error location

## Result Structure

The result returned by `nutso` is also typesafe, meaning you will be able to access the validation result and the `errorMessage` in a type-safe way. You will feel absolutely in control when using the validation result. And again, because it's typesafe as well, when you update the schema, typescript will help you to fix your result wherever you have used it. voila!

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

Result characteristics:
- Each validation returns type-specific result objects
- All results include `isValid` flag
- Failed validations include error messages and paths
- Results maintain the same structure as the validated object

## Type Guards for Results

For more convenient handling of validation results, `nutso` provides type guards that help you distinguish between success and failure cases with proper TypeScript type narrowing:

```typescript
import { validate, isValidationFailure, isValidationSuccess } from 'nutso';

const result = validate(customer, customerSchema);

// Using isValidationFailure type guard
if (isValidationFailure(result)) {
  // TypeScript knows result is ValidationFailure here
  console.log('Validation failed:', result.errorMessage);
  console.log('Error path:', result.errorPath);
  // You can safely access errorMessage and errorPath
} else {
  // TypeScript knows result is ValidationSuccess here
  console.log('Validation passed!');
  // result.errorMessage and result.errorPath are not available here
}

// Using isValidationSuccess type guard
if (isValidationSuccess(result)) {
  // TypeScript knows result is ValidationSuccess here
  console.log('Validation succeeded!');
} else {
  // TypeScript knows result is ValidationFailure here
  console.log('Validation failed:', result.errorMessage);
}
```

### Available Type Guards

- `isValidationFailure(result: Result<T>): result is ValidationFailure` - Returns `true` if the validation failed
- `isValidationSuccess(result: Result<T>): result is ValidationSuccess` - Returns `true` if the validation succeeded

These type guards provide better type safety and code clarity when working with validation results, especially in complex validation scenarios where you need to handle both success and failure cases differently.

## Error Paths

When validation errors occur, `nutso` provides precise error paths that indicate exactly where in the object structure the error occurred. The `errorPath` property is an array of strings that represents the path to the error:

```typescript
// For a nested object structure
const user = {
  name: "John",
  address: {
    street: "123 Main St",
    city: "", // Invalid - empty string when minLength: 1 is specified
  },
};

// Schema with minLength to disallow empty strings
const userSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1, // Disallow empty strings
    },
    address: {
      type: "object",
      properties: {
        street: { type: "string" }, // Empty strings are valid here
        city: {
          type: "string",
          minLength: 1, // Disallow empty strings
        },
      },
    },
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

# Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# License

MIT
