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

  const addressSchema: Schema<Address, any> = {
    type: "object",
    properties: {
      city: {
        type: "string",
      },
    },
  };
  const customerSchema: Schema<Customer, any> = {
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
  validate(customer, customerSchema);
});
