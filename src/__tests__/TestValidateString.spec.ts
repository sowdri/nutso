import { StringSchema } from "../models/schema/StringSchema";
import { validate } from "../validate/validate";
import { validateString } from "../validate/validateString";

test(`Basic`, () => {
  const str = "foo";
  const schema: StringSchema = {
    type: "string",
  };
  const result1 = validateString({ value: str, root: str, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - invalid`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
  };
  const result1 = validateString({ value: str, root: str, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(false);
});

test(`Empty string - not optional`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
    optional: () => false,
  };
  const result1 = validateString({ value: str, root: str, schema, parent: undefined as any });
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
  const result1 = validateString({ value: str, root: str, schema, parent: undefined as any });
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
  const result1 = validateString({ value: str, root: str, schema, parent: undefined as any });
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

  const result1 = validateString({ value: valid, root: valid, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(invalid, schema);
  expect(result2.isValid).toBe(false);
});

test(`Validation function - check value`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (args) => {
      if (args.value === "5085") return;
      return {
        errorMessage: "Invalid",
      };
    },
  };
  const valid = "5085";

  const result = validateString({ value: valid, root: valid, schema, parent: undefined as any });
  expect(result).toMatchInlineSnapshot(`
{
  "errorMessage": "",
  "errorPath": [],
  "isValid": true,
}
`);
});

test(`Validation function - return validation result`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (value) => {
      return {
        errorMessage: "Custom validation failed",
      };
    },
  };
  const valid = "5085";

  const result = validateString({ value: valid, root: valid, schema, parent: undefined as any });
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

  const result = validateString({ value: valid, root: valid, schema, parent: undefined as any });
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

  const result = validateString({ value: valid, root: valid, schema, parent: undefined as any });
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

  const result = validateString({ value: valid, root: valid, schema, parent: undefined as any });
  expect(result).toMatchSnapshot();
});
