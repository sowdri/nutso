import { ObjectSchema } from "../models/schema/ObjectSchema";
import { validateObject } from "../validate/validateObject";
import { validate } from "../validate/validate";

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
        minLength: 3
      }
    }
  };

  const result1 = validateObject(obj, schema);
  expect(result1.isValid).toBe(false);

  const result2 = validate(obj, schema);
  expect(result2.isValid).toBe(false);
});

test(`Address is optional in schema and undefined in object`, () => {
  type Customer = {
    name: "";
    address?: {
      city: string;
    };
  };

  const obj: Customer = { name: "" };
  const schema: ObjectSchema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3
      },
      address: {
        type: "object",
        properties: {
          city: {
            type: "string"
          }
        }
      }
    }
  };

  const result = validateObject(obj, schema);
  expect(result).toMatchSnapshot();
});
