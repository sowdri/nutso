import { Schema } from "../models/schema/Schema";
import { validate } from "../validate/validate";

type Customer = {
  name: string;
  address: {
    line1: string;
    country: string;
  };
};

test(`Test multi-level`, () => {
  const customerSchema: Schema<Customer> = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 24,
      },
      address: {
        type: "object",
        properties: {
          line1: {
            type: "string",
          },
          country: {
            type: "string",
            minLength: 8,
          },
        },
      },
    },
  };

  const customer: Customer = {
    name: "John",
    address: {
      line1: "6 Example St",
      country: "US",
    },
  };

  expect(validate(customer, customerSchema)).toMatchSnapshot();
});
