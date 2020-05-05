import { StringSchema } from "../models/schema/StringSchema";
import { validateNumber } from "../validate/validateNumber";
import { validate } from "../validate/validate";
import { Schema } from "../models/schema/Schema";
import { NumberSchema } from "../models/schema/NumberSchema";

test(`Basic`, () => {
  const numbr = 3;
  const schema: NumberSchema = {
    type: "number",
  };
  const result1 = validateNumber({ value: numbr, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(numbr, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - invalid number`, () => {
  const str = "";
  const schema: NumberSchema = {
    type: "number",
  };
  const result1 = validateNumber({ value: str, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate((str as unknown) as number, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid min`, () => {
  const num = 2;
  const schema: NumberSchema = {
    type: "number",
    min: 3,
  };
  const result1 = validateNumber({ value: num, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(num, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid max`, () => {
  const num = 100;
  const schema: NumberSchema = {
    type: "number",
    max: 10,
  };
  const result1 = validateNumber({ value: num, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(num, schema);
  expect(result2.isValid).toBe(false);
});

test(`Regex match`, () => {
  const schema: NumberSchema = {
    type: "number",
    pattern: /5\d{3}/,
  };
  const valid = 5085;
  const invalid = 508;

  const result1 = validateNumber({ value: valid, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(invalid, schema);
  expect(result2.isValid).toBe(false);
});

test(`Validation function - pass`, () => {
  const schema: NumberSchema = {
    type: "number",
    validationFn: (value) => {
      if (value === 5085)
        return {
          errorMessage: "Custom validation failed",
        };
    },
  };
  const value = 5086;

  const result = validateNumber({ value, schema, parent: undefined as any });
  expect(result.isValid).toBe(true);
});

test(`Validation function - fail`, () => {
  const schema: NumberSchema = {
    type: "number",
    validationFn: (value) => {
      if (value === 5085)
        return {
          errorMessage: "Custom validation failed",
        };
    },
  };
  const value = 5085;

  const result = validateNumber({ value, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error`, () => {
  const schema: NumberSchema = {
    type: "number",
    validationFn: (value) => {
      throw new Error(`Validation fn threw!`);
    },
  };
  const value = 5085;
  const result = validateNumber({ value, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - valid`, () => {
  const schema: NumberSchema = {
    type: "number",
    validationFn: (value) => {
      throw { message: "Custom error object, with message field" };
    },
  };
  const value = 5085;

  const result = validateNumber({ value, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - invalid`, () => {
  const schema: NumberSchema = {
    type: "number",
    validationFn: (value) => {
      throw { foo: "Custom error object, with message field" };
    },
  };
  const value = 5085;
  const result = validateNumber({ value, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});
