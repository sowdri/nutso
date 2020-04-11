import { StringSchema } from "../models/schema/StringSchema";
import { validateDate } from "../validate/validateDate";
import { _validate } from "../validate/validate";
import { Schema } from "../models/schema/Schema";
import { DateSchema } from "../models/schema/DateSchema";

test(`Basic`, () => {
  const date = new Date();

  const schema: DateSchema<Date> = {
    type: "date",
  };
  const result1 = validateDate(date, date, schema);
  expect(result1.isValid).toBe(true);

  const result2 = _validate(date, date, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty date - invalid`, () => {
  const date = undefined as any;
  const schema: DateSchema<Date> = {
    type: "date",
  };
  const result1 = validateDate(date, date, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate(date, date, schema);
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

  const result = validateDate(valid, valid, schema);
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

  const result = validateDate(valid, valid, schema);
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

  const result = validateDate(valid, valid, schema);
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

  const result = validateDate(valid, valid, schema);
  expect(result).toMatchSnapshot();
});
