import { BooleanSchema } from "../models/schema/BooleanSchema";
import { StringSchema } from "../models/schema/StringSchema";
import { validate } from "../validate/validate";
import { validateBoolean } from "../validate/validateBoolean";
import { validateString } from "../validate/validateString";

test(`Boolean - undefined - optional`, () => {
  const value = undefined;
  const schema: BooleanSchema = {
    type: "boolean",
    optional: true,
  };
  const result1 = validateBoolean({ value, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(true);
});

test(`Boolean - undefined - required`, () => {
  const value = undefined;
  const schema: BooleanSchema = {
    type: "boolean",
  };
  const result1 = validateBoolean({ value, schema, parent: undefined as any });
  expect(result1.isValid).toBe(false);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(false);
});

test(`Boolean - defined`, () => {
  const value = true;
  const schema: BooleanSchema = {
    type: "boolean",
  };
  const result1 = validateBoolean({ value, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(true);
});

test(`Boolean - validationFn - should be true - success`, () => {
  const value = true;
  const schema: BooleanSchema = {
    type: "boolean",
    validationFn: (value) => {
      if (value) return;
      return { errorMessage: "Value should be true" };
    },
  };
  const result1 = validateBoolean({ value, schema, parent: undefined as any });
  expect(result1.isValid).toBe(true);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(true);
});

test(`Boolean - validationFn - should be true - failure`, () => {
  const value = false;
  const schema: BooleanSchema = {
    type: "boolean",
    validationFn: (value) => {
      if (value) return;
      return { errorMessage: "Value should be true" };
    },
  };
  const result1 = validateBoolean({ value, schema, parent: undefined as any });
  expect(result1).toMatchInlineSnapshot(`
{
  "errorMessage": "Value should be true",
  "errorPath": [],
  "isValid": false,
}
`);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2).toMatchInlineSnapshot(`
{
  "errorMessage": "Value should be true",
  "errorPath": [],
  "isValid": false,
}
`);
});

// test(`Empty string - invalid`, () => {
//   const str = "";
//   const schema: StringSchema = {
//     type: "string",
//   };
//   const result1 = validateString({ value: str, schema, parent: undefined as any });
//   expect(result1.isValid).toBe(false);

//   const result2 = validate(str, schema);
//   expect(result2.isValid).toBe(false);
// });

// test(`Empty string - not optional`, () => {
//   const str = "";
//   const schema: StringSchema = {
//     type: "string",
//     optional: () => false,
//   };
//   const result1 = validateString({ value: str, schema, parent: undefined as any });
//   expect(result1.isValid).toBe(false);

//   const result2 = validate(str, schema);
//   expect(result2.isValid).toBe(false);
// });

// test(`Basic - invalid min-length`, () => {
//   const str = "";
//   const schema: StringSchema = {
//     type: "string",
//     minLength: 3,
//   };
//   const result1 = validateString({ value: str, schema, parent: undefined as any });
//   expect(result1.isValid).toBe(false);

//   const result2 = validate(str, schema);
//   expect(result2.isValid).toBe(false);
// });

// test(`Basic - invalid max-length`, () => {
//   const str = "foo-bar";
//   const schema: StringSchema = {
//     type: "string",
//     maxLength: 3,
//   };
//   const result1 = validateString({ value: str, schema, parent: undefined as any });
//   expect(result1.isValid).toBe(false);

//   const result2 = validate(str, schema);
//   expect(result2.isValid).toBe(false);
// });

// test(`Regex match`, () => {
//   const schema: StringSchema = {
//     type: "string",
//     pattern: /5\d{3}/,
//   };
//   const valid = "5085";
//   const invalid = "508";

//   const result1 = validateString({ value: valid, schema, parent: undefined as any });
//   expect(result1.isValid).toBe(true);

//   const result2 = validate(invalid, schema);
//   expect(result2.isValid).toBe(false);
// });

// test(`Validation function`, () => {
//   const schema: StringSchema = {
//     type: "string",
//     validationFn: (value) => {
//       return {
//         errorMessage: "Custom validation failed",
//       };
//     },
//   };
//   const valid = "5085";

//   const result = validateString({ value: valid, schema, parent: undefined as any });
//   expect(result).toMatchSnapshot();
// });

// test(`Validation function - throw error`, () => {
//   const schema: StringSchema = {
//     type: "string",
//     validationFn: (value) => {
//       throw new Error(`Validation fn threw!`);
//     },
//   };
//   const valid = "5085";

//   const result = validateString({ value: valid, schema, parent: undefined as any });
//   expect(result).toMatchSnapshot();
// });

// test(`Validation function - throw error object - valid`, () => {
//   const schema: StringSchema = {
//     type: "string",
//     validationFn: (value) => {
//       throw { message: "Custom error object, with message field" };
//     },
//   };
//   const valid = "5085";

//   const result = validateString({ value: valid, schema, parent: undefined as any });
//   expect(result).toMatchSnapshot();
// });

// test(`Validation function - throw error object - invalid`, () => {
//   const schema: StringSchema = {
//     type: "string",
//     validationFn: (value) => {
//       throw { foo: "Custom error object, with message field" };
//     },
//   };
//   const valid = "5085";

//   const result = validateString({ value: valid, schema, parent: undefined as any });
//   expect(result).toMatchSnapshot();
// });
