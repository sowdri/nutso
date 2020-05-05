import { DateSchema } from "../models/schema/DateSchema";
import { validate } from "../validate/validate";
import { validateDate } from "../validate/validateDate";

test(`Basic`, () => {
  const date = new Date();

  const schema: DateSchema = {
    type: "date",
  };
  const result1 = validateDate({ value: date, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(date, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty date - invalid`, () => {
  const date = undefined as any;
  const schema: DateSchema = {
    type: "date",
  };
  const result1 = validateDate({ value: date, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(date, schema);
  expect(result2.isValid).toBe(false);
});

test(`Validation function`, () => {
  const schema: DateSchema<Date> = {
    type: "date",
    validationFn: (value) => {
      return {
        errorMessage: "Custom validation failed",
      };
    },
  };
  const valid = new Date();

  const result = validateDate({ value: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error`, () => {
  const schema: DateSchema<Date> = {
    type: "date",
    validationFn: (value) => {
      throw new Error(`Validation fn threw!`);
    },
  };
  const valid = new Date();

  const result = validateDate({ value: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - valid`, () => {
  const schema: DateSchema<Date> = {
    type: "date",
    validationFn: (value) => {
      throw { message: "Custom error object, with message field" };
    },
  };
  const valid = new Date();

  const result = validateDate({ value: valid, parent: undefined as any, schema });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - invalid`, () => {
  const schema: DateSchema<Date> = {
    type: "date",
    validationFn: (value) => {
      throw { foo: "Custom error object, with message field" };
    },
  };
  const valid = new Date();

  const result = validateDate({ value: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});
