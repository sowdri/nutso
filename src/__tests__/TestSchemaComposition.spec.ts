import { Schema } from "..";
import { validate } from "../validate/validate";

test(`Compose schema - 1`, () => {
  type Address = {
    city: string;
  };
  type Customer = {
    name: string;
    address: Address;
  };

  const addressSchema: Schema<Address, Customer> = {
    type: "object",
    properties: {
      city: {
        type: "string",
      },
    },
  };
  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
      },
      address: addressSchema,
    },
  };
  const customer: Customer = {
    name: "John",
    address: {
      city: "NY",
    },
  };
  const result = validate(customer, customerSchema);
  expect(result).toMatchInlineSnapshot(`
{
  "errorMessage": "",
  "errorPath": [],
  "isValid": true,
  "properties": {
    "address": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
      "properties": {
        "city": {
          "errorMessage": "",
          "errorPath": [],
          "isValid": true,
        },
      },
    },
    "name": {
      "errorMessage": "",
      "errorPath": [],
      "isValid": true,
    },
  },
}
`);
});
