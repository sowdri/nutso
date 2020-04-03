import { StringSchema } from "../models/schema/StringSchema";
import { validateString } from "../validate/validateString";
import { _validate } from "../validate/validate";
import { Schema } from "../models/schema/Schema";

test(`Basic`, () => {
  const str = "foo";
  const schema: StringSchema<string> = {
    type: "string"
  };
  const result1 = validateString(str, str, schema);
  expect(result1.isValid).toBe(true);

  const result2 = _validate(str, str, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - invalid`, () => {
  const str = "";
  const schema: StringSchema<string> = {
    type: "string"
  };
  const result1 = validateString(str, str, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate(str, str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid min-length`, () => {
  const str = "";
  const schema: StringSchema<string> = {
    type: "string",
    minLength: 3
  };
  const result1 = validateString(str, str, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate(str, str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid max-length`, () => {
  const str = "foo-bar";
  const schema: StringSchema<string> = {
    type: "string",
    maxLength: 3
  };
  const result1 = validateString(str, str, schema);
  expect(result1.isValid).toBe(false);

  const result2 = _validate(str, str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Regex match`, () => {
  const schema: StringSchema<string> = {
    type: "string",
    pattern: /5\d{3}/
  };
  const valid = "5085";
  const invalid = "508";

  const result1 = validateString(valid, valid, schema);
  expect(result1.isValid).toBe(true);

  const result2 = _validate(invalid, valid, schema);
  expect(result2.isValid).toBe(false);
});

test(`Validation function`, () => {
  const schema: StringSchema<string> = {
    type: "string",
    validationFn: value => {
      return {
        errorMessage: "Custom validation failed"
      };
    }
  };
  const valid = "5085";

  const result = validateString(valid, valid, schema);
  expect(result).toMatchSnapshot();
});
