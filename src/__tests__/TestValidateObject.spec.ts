import { ObjectSchema } from "../models/schema/ObjectSchema";
import { Schema } from "../models/schema/Schema";
import { validate, _validate } from "../validate/validate";
import { validateObject } from "../validate/validateObject";

test(`Basic`, () => {
  type Customer = {
    name: "";
  };

  const obj: Customer = { name: "" };
  const schema: ObjectSchema<Customer, Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3
      }
    }
  };

  const result1 = validateObject(obj, obj, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate(obj, obj, schema);
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
        minLength: 3
      },
      address: {
        type: "object",
        optional: true,
        properties: {
          city: {
            type: "string"
          }
        }
      }
    }
  };

  const result = validate(obj, schema);
  expect(result).toMatchSnapshot();
});

test(``, () => {
  type Customer = {
    name: string;
    props: { [key: string]: string };
  };

  const schema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string"
      },
      props: {
        type: "object",
        properties: {}
      }
    }
  };
});
