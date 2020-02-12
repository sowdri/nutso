import { Schema } from "../schema/Schema";
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
    required: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
        required: true
      },
      address: {
        type: "object",
        required: false,
        properties: {
          line1: {
            type: "string",
            required: true
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
  expect(validate(customer, customerSchema, [])).toMatchSnapshot();
});
