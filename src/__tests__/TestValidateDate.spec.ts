import { DateSchema } from "../models/schema/DateSchema";
import { validate } from "../validate/validate";
import { validateDate } from "../validate/validateDate";

test(`Basic`, () => {
  const date = new Date();

  const schema: DateSchema = {
    type: "date",
  };
  const result1 = validateDate({
    value: date,
    root: date,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(date, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty date - invalid`, () => {
  const date = undefined as any;
  const schema: DateSchema = {
    type: "date",
  };
  const result1 = validateDate({
    value: date,
    root: date,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(false);

  const result2 = validate(date, schema);
  expect(result2.isValid).toBe(false);
});

test(`Validation function`, () => {
  const schema: DateSchema = {
    type: "date",
    validationFn: (args: { value: Date; parent?: unknown; root: unknown }) => {
      return {
        errorMessage: "Custom validation failed",
      };
    },
  };
  const valid = new Date();

  const result = validateDate({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error`, () => {
  const schema: DateSchema = {
    type: "date",
    validationFn: (args: { value: Date; parent?: unknown; root: unknown }) => {
      throw new Error(`Validation fn threw!`);
    },
  };
  const valid = new Date();

  const result = validateDate({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - valid`, () => {
  const schema: DateSchema = {
    type: "date",
    validationFn: (args: { value: Date; parent?: unknown; root: unknown }) => {
      throw { message: "Custom error object, with message field" };
    },
  };
  const valid = new Date();

  const result = validateDate({
    value: valid,
    root: valid,
    parent: undefined as any,
    schema,
    path: [],
  });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - invalid`, () => {
  const schema: DateSchema = {
    type: "date",
    validationFn: (args: { value: Date; parent?: unknown; root: unknown }) => {
      throw { foo: "Custom error object, with message field" };
    },
  };
  const valid = new Date();

  const result = validateDate({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchSnapshot();
});
