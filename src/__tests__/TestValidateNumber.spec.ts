import { StringSchema } from "../models/schema/StringSchema";
import { validateNumber } from "../validate/validateNumber";
import { _validate } from "../validate/validate";
import { Schema } from "../models/schema/Schema";
import { NumberSchema } from "../models/schema/NumberSchema";

test(`Basic`, () => {
  const numbr = 3;
  const schema: NumberSchema<number> = {
    type: "number",
  };
  const result1 = validateNumber(numbr, numbr, schema);
  expect(result1.isValid).toBe(true);

  const result2 = _validate(numbr, numbr, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - invalid number`, () => {
  const str = "";
  const schema: NumberSchema<number> = {
    type: "number",
  };
  const result1 = validateNumber(str, str as any, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate((str as unknown) as number, str as any, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid min`, () => {
  const num = 2;
  const schema: NumberSchema<number> = {
    type: "number",
    min: 3,
  };
  const result1 = validateNumber(num, num, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate(num, num, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid max`, () => {
  const num = 100;
  const schema: NumberSchema<number> = {
    type: "number",
    max: 10,
  };
  const result1 = validateNumber(num, num, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate(num, num, schema);
  expect(result2.isValid).toBe(false);
});

test(`Regex match`, () => {
  const schema: NumberSchema<number> = {
    type: "number",
    pattern: /5\d{3}/,
  };
  const valid = 5085;
  const invalid = 508;

  const result1 = validateNumber(valid, valid, schema);
  expect(result1.isValid).toBe(true);

  const result2 = _validate(invalid, valid, schema);
  expect(result2.isValid).toBe(false);
});

test(`Validation function - pass`, () => {
  const schema: NumberSchema<number> = {
    type: "number",
    validationFn: (value) => {
      if (value === 5085)
        return {
          errorMessage: "Custom validation failed",
        };
    },
  };
  const value = 5086;

  const result = validateNumber(value, value, schema);
  expect(result.isValid).toBe(true);
});

test(`Validation function - fail`, () => {
  const schema: NumberSchema<number> = {
    type: "number",
    validationFn: (value) => {
      if (value === 5085)
        return {
          errorMessage: "Custom validation failed",
        };
    },
  };
  const value = 5085;

  const result = validateNumber(value, value, schema);
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error`, () => {
  const schema: NumberSchema<number> = {
    type: "number",
    validationFn: (value) => {
      throw new Error(`Validation fn threw!`);
    },
  };
  const value = 5085;
  const result = validateNumber(value, value, schema);
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - valid`, () => {
  const schema: NumberSchema<number> = {
    type: "number",
    validationFn: (value) => {
      throw { message: "Custom error object, with message field" };
    },
  };
  const value = 5085;

  const result = validateNumber(value, value, schema);
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - invalid`, () => {
  const schema: NumberSchema<number> = {
    type: "number",
    validationFn: (value) => {
      throw { foo: "Custom error object, with message field" };
    },
  };
  const value = 5085;
  const result = validateNumber(value, value, schema);
  expect(result).toMatchSnapshot();
});
