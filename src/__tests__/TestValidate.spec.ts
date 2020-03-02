import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";

interface Customer {
  name: string;
  address: Address;
}
interface Address {
  line1: string;
}

test(`Test customer schema`, () => {
  const customerSchema: Schema<Customer> = {
    type: "object",
    optional: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string"
          }
        }
      }
    }
  };
  const customer: Customer = {
    name: "nish",
    address: {
      line1: "18/19 Lightsview"
    }
  };
  expect(validate(customer, customer, customerSchema)).toMatchSnapshot();
});
