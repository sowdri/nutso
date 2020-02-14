import { Schema } from "../schema/Schema";
import { validate } from "../validate/validate";
import { Result } from "../result/Result";

type Customer = {
  name: string;
  dob: Date;
  height: number;
};

const customerSchema: Schema<Customer> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 24
    },
    dob: {
      type: "date"
    },
    height: {
      type: "number",
      min: 0.1,
      max: 7.5
    }
  }
};

const customer: Customer = {
  name: "John Appleseed",
  dob: new Date(), // just born
  height: 3.2
};

test(`Customer schema`, () => {
  const result: Result<Customer> = validate(customer, customerSchema);
  expect(result).toMatchSnapshot();
});
