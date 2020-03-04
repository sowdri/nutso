import { ObjectSchema } from "../models/schema/ObjectSchema";
import { validateObject } from "../validate/validateObject";
import { _validate } from "../validate/validate";

type Customer = {
  name: "";
};

test(`Basic`, () => {
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
