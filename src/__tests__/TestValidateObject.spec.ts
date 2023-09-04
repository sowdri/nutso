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
