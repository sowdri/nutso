import { StringSchema } from "../models/schema/StringSchema";
import { validateString } from "../validate/validateString";
import { validate } from "../validate/validate";

test(`Basic`, () => {
  const str = "foo";
  const schema: StringSchema = {
    type: "string"
  };
  const result1 = validateString(str, schema);
  expect(result1.isValid).toBe(true);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - invalid`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string"
  };
  const result1 = validateString(str, schema);
  expect(result1.isValid).toBe(false);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid min-length`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
    minLength: 3
  };
  const result1 = validateString(str, schema);
  expect(result1.isValid).toBe(false);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Basic - invalid max-length`, () => {
  const str = "foo-bar";
  const schema: StringSchema = {
    type: "string",
    maxLength: 3
  };
  const result1 = validateString(str, schema);
  expect(result1.isValid).toBe(false);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Regex match`, () => {
  const schema: StringSchema = {
    type: "string",
    pattern: /5\d{3}/
  };
  const valid = "5085";
  const invalid = "508";

  const result1 = validateString(valid, schema);
  expect(result1.isValid).toBe(true);

  const result2 = validate(invalid, schema);
  expect(result2.isValid).toBe(false);
});
