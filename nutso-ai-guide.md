# Nutso Quick Reference Guide for AI Agents

> **Documentation**: [https://www.npmjs.com/package/nutso/v/6.0.0-alpha.5](https://www.npmjs.com/package/nutso/v/6.0.0-alpha.5)

## Basic Object Validation

```typescript
import { Schema, validate } from "nutso";

// Define the type
type User = {
  name: string;
  age: number;
  email: string;
};

// Define the schema
const userSchema: Schema<User> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2 },
    age: { type: "number", min: 18 },
    email: { type: "string", pattern: /^[\w.-]+@[\w.-]+\.\w+$/ },
  },
};

// Validate
const user = { name: "John", age: 25, email: "john@example.com" };
const result = validate(user, userSchema);
if (result.isValid) {
  // Process valid data
} else {
  // Handle validation errors
  console.log(result.errorMessage, result.errorPath);
}
```

## Nested Objects

```typescript
type Address = {
  street: string;
  city: string;
  zipCode: string;
};

type UserWithAddress = {
  name: string;
  address: Address;
};

const addressSchema: Schema<Address> = {
  type: "object",
  properties: {
    street: { type: "string" },
    city: { type: "string" },
    zipCode: { type: "string", pattern: /^\d{5}$/ },
  },
};

const userSchema: Schema<UserWithAddress> = {
  type: "object",
  properties: {
    name: { type: "string" },
    address: addressSchema,
  },
};
```

## Array Validation

```typescript
type TodoList = {
  tasks: string[];
};

const todoSchema: Schema<TodoList> = {
  type: "object",
  properties: {
    tasks: {
      type: "array",
      minItems: 1,
      items: { type: "string", minLength: 3 },
    },
  },
};
```

## Optional Fields

```typescript
type Profile = {
  username: string;
  bio?: string;
};

const profileSchema: Schema<Profile> = {
  type: "object",
  properties: {
    username: { type: "string" },
    bio: { type: "string", optional: true },
  },
};
```

## Conditional Validation with isApplicableFn

```typescript
type Payment = {
  method: "credit" | "paypal";
  cardNumber?: string;
  email?: string;
};

const paymentSchema: Schema<Payment> = {
  type: "object",
  properties: {
    method: { type: "string", values: ["credit", "paypal"] },
    cardNumber: {
      type: "string",
      pattern: /^\d{16}$/,
      isApplicableFn: ({ parent }) => parent.method === "credit",
    },
    email: {
      type: "string",
      pattern: /^[\w.-]+@[\w.-]+\.\w+$/,
      isApplicableFn: ({ parent }) => parent.method === "paypal",
    },
  },
};
```

## Discriminated Unions

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
      isApplicableFn: ({ parent }) => parent.type === "circle",
    },
    width: {
      type: "number",
      isApplicableFn: ({ parent }) => parent.type === "rectangle",
    },
    height: {
      type: "number",
      isApplicableFn: ({ parent }) => parent.type === "rectangle",
    },
  },
};

// Method 2: Using Schema<Union<T>> for better type safety
import { Union } from "nutso";

const unionShapeSchema: Schema<Union<Shape>> = {
  type: "object",
  properties: {
    // Same properties as above, but TypeScript enforces including all properties
  },
};

// Use validate with either schema type
const result = validate(shape, unionShapeSchema);
```

## Custom Validation Functions

```typescript
const passwordSchema: Schema<string> = {
  type: "string",
  minLength: 8,
  validationFn: ({ value }) => {
    // Must contain at least one uppercase, lowercase, and number
    if (!/[A-Z]/.test(value))
      return { isValid: false, errorMessage: "Missing uppercase letter" };
    if (!/[a-z]/.test(value))
      return { isValid: false, errorMessage: "Missing lowercase letter" };
    if (!/[0-9]/.test(value))
      return { isValid: false, errorMessage: "Missing number" };
    return { isValid: true };
  },
};
```

## Error Handling

```typescript
const result = validate(data, schema);
if (!result.isValid) {
  // Get specific field errors
  if (result.properties) {
    for (const field in result.properties) {
      if (!result.properties[field].isValid) {
        console.log(`${field}: ${result.properties[field].errorMessage}`);
      }
    }
  }

  // Get the path to the error
  console.log(`Error path: ${result.errorPath.join(".")}`);
}
```
