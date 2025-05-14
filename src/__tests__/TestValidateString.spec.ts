import { StringSchema } from "../models/schema/StringSchema";
import { validate } from "../validate/validate";
import { validateString } from "../validate/validateString";
import { ValidationFailure } from "../models/result/ValidationResult";
import { StringResult } from "../models/result/StringResult";

test(`Basic`, () => {
  const str = "foo";
  const schema: StringSchema = {
    type: "string",
  };
  const result1 = validateString({
    value: str,
    root: str,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - is valid`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
  };
  const result1 = validateString({
    value: str,
    root: str,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - not optional - valid`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
    optional: () => false,
  };
  const result1 = validateString({
    value: str,
    root: str,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(str, schema);
  expect(result2.isValid).toBe(true);
});

test(`Empty string - not optional - minLength:1 - invalid`, () => {
  const str = "";
  const schema: StringSchema = {
    type: "string",
    optional: () => false,
    minLength: 1,
  };
  const result1 = validateString({
    value: str,
    root: str,
    schema,
    parent: undefined as any,
    path: [],
  });
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
  const result1 = validateString({
    value: str,
    root: str,
    schema,
    parent: undefined as any,
    path: [],
  });
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
  const result1 = validateString({
    value: str,
    root: str,
    schema,
    parent: undefined as any,
    path: [],
  });
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

  const result1 = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
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

  const result = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchInlineSnapshot(`
{
  "isValid": true,
}
`);
});

test(`Validation function - return validation result`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (args) => {
      return {
        errorMessage: "Custom validation failed",
      };
    },
  };
  const valid = "5085";

  const result = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (args) => {
      throw new Error(`Validation fn threw!`);
    },
  };
  const valid = "5085";

  const result = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - valid`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (args) => {
      throw { message: "Custom error object, with message field" };
    },
  };
  const valid = "5085";

  const result = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchSnapshot();
});

test(`Validation function - throw error object - invalid`, () => {
  const schema: StringSchema = {
    type: "string",
    validationFn: (args) => {
      throw { foo: "Custom error object, with message field" };
    },
  };
  const valid = "5085";

  const result = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result).toMatchSnapshot();
});

test(`Values - valid option`, () => {
  const schema: StringSchema = {
    type: "string",
    values: ["red", "green", "blue"],
  };
  const valid = "green";

  const result1 = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(valid, schema);
  expect(result2.isValid).toBe(true);
});

test(`Values - invalid option`, () => {
  const schema: StringSchema = {
    type: "string",
    values: ["red", "green", "blue"],
  };
  const invalid = "yellow";

  const result1 = validateString({
    value: invalid,
    root: invalid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(false);
  expect((result1 as ValidationFailure).errorMessage).toContain(
    "Should be one of: red, green, blue"
  );

  const result2 = validate(invalid, schema);
  expect(result2.isValid).toBe(false);
  expect((result2 as ValidationFailure).errorMessage).toContain(
    "Should be one of: red, green, blue"
  );
});

test(`Values - empty array`, () => {
  const schema: StringSchema = {
    type: "string",
    values: [],
  };
  const value = "anything";

  const result = validateString({
    value,
    root: value,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result.isValid).toBe(true);
});

test(`Exact Value - valid match`, () => {
  const schema: StringSchema = {
    type: "string",
    value: "exact-match",
  };
  const valid = "exact-match";

  const result1 = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(valid, schema);
  expect(result2.isValid).toBe(true);
});

test(`Exact Value - invalid match`, () => {
  const schema: StringSchema = {
    type: "string",
    value: "exact-match",
  };
  const invalid = "not-exact-match";

  const result1 = validateString({
    value: invalid,
    root: invalid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(false);
  expect((result1 as ValidationFailure).errorMessage).toContain(
    'Should be exactly: "exact-match"'
  );

  const result2 = validate(invalid, schema);
  expect(result2.isValid).toBe(false);
});

test(`Exact Value takes precedence over values array`, () => {
  const schema: StringSchema = {
    type: "string",
    value: "exact-match",
    values: ["one", "two", "three", "exact-match"],
  };
  const valid = "exact-match";
  const invalid = "one"; // This is in the values array but not the exact value

  const result1 = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validateString({
    value: invalid,
    root: invalid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result2.isValid).toBe(false);
  expect((result2 as ValidationFailure).errorMessage).toContain(
    'Should be exactly: "exact-match"'
  );
});

test(`Allowable values fail`, () => {
  const schema: StringSchema = {
    type: "string",
    values: ["red", "green", "blue"],
  };
  const valid = "red";
  const invalid = "purple";

  const result1 = validateString({
    value: invalid,
    root: invalid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(false);
  expect((result1 as ValidationFailure).errorMessage).toContain(
    "Should be one of: red, green, blue"
  );

  const result2 = validate(invalid, schema);
  expect(result2.isValid).toBe(false);
  expect((result2 as ValidationFailure).errorMessage).toContain(
    "Should be one of: red, green, blue"
  );
});

test(`Exact value - takes precedence over minLength`, () => {
  const schema: StringSchema = {
    type: "string",
    value: "exact-match",
    minLength: 20, // Longer than the exact value
  };
  const valid = "exact-match";
  const invalid = "not-exact-match";

  const result1 = validateString({
    value: valid,
    root: valid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validateString({
    value: invalid,
    root: invalid,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result2.isValid).toBe(false);
  expect((result2 as ValidationFailure).errorMessage).toContain(
    'Should be exactly: "exact-match"'
  );
});

test(`Validation of empty strings - demonstrates recommended approaches`, () => {
  // 1. Empty string with default string schema - should be valid
  const emptyString = "";
  const basicSchema: StringSchema = {
    type: "string",
  };

  const result1 = validate(emptyString, basicSchema);
  expect(result1.isValid).toBe(true);

  // 2. Using minLength to disallow empty strings
  const disallowEmptySchema: StringSchema = {
    type: "string",
    minLength: 1,
  };

  const result2 = validate(emptyString, disallowEmptySchema);
  expect(result2.isValid).toBe(false);

  // 3. Using a pattern to disallow empty strings
  const patternSchema: StringSchema = {
    type: "string",
    pattern: /.+/,
  };

  const result3 = validate(emptyString, patternSchema);
  expect(result3.isValid).toBe(false);

  // 4. Using validationFn to disallow empty strings
  const validationFnSchema: StringSchema = {
    type: "string",
    validationFn: ({ value }) => {
      if (value === "") {
        return { errorMessage: "Empty string not allowed" };
      }
    },
  };

  const result4 = validate(emptyString, validationFnSchema);
  expect(result4.isValid).toBe(false);
  expect((result4 as ValidationFailure).errorMessage).toBe(
    "Empty string not allowed"
  );
});
