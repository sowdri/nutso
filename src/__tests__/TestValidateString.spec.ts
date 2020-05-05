import { StringSchema } from "../models/schema/StringSchema";
import { validateString } from "../validate/validateString";
import { validate } from "../validate/validate";
import { Schema } from "../models/schema/Schema";

test(`Basic`, () => {
  const str = "foo";
  const schema: StringSchema = {
    type: "string",
  };
  const result1 = validateString({ value: str, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - invalid`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
  };
  const result1 = validateString({ value: str, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid min-length`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
    minLength: 3,
  };
  const result1 = validateString({ value: str, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid max-length`, () => {
  const str = "foo-bar";
  const schema: StringSchema = {
    type: "string",
    maxLength: 3,
  };
  const result1 = validateString({ value: str, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Regex match`, () => {
  const schema: StringSchema = {
    type: "string",
    pattern: /5\d{3}/,
  };
  const valid = "5085";
  const invalid = "508";

  const result1 = validateString({ value: valid, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(invalid, schema);
  expect(result2.isValid).toBe(false);
});

test(`Validation function`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (value) => {
      return {
        errorMessage: "Custom validation failed",
      };
    },
  };
  const valid = "5085";

  const result = validateString({ value: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (value) => {
      throw new Error(`Validation fn threw!`);
    },
  };
  const valid = "5085";

  const result = validateString({ value: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - valid`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (value) => {
      throw { message: "Custom error object, with message field" };
    },
  };
  const valid = "5085";

  const result = validateString({ value: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - invalid`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (value) => {
      throw { foo: "Custom error object, with message field" };
    },
  };
  const valid = "5085";

  const result = validateString({ value: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});
