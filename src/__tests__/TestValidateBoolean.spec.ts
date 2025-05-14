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
  const result1 = validateBoolean({
    value,
    root: value as unknown as boolean,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(true);
});

test(`Boolean - undefined - required`, () => {
  const value = undefined;
  const schema: BooleanSchema = {
    type: "boolean",
  };
  const result1 = validateBoolean({
    value,
    root: value as unknown as boolean,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(false);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(false);
});

test(`Boolean - defined`, () => {
  const value = true;
  const schema: BooleanSchema = {
    type: "boolean",
  };
  const result1 = validateBoolean({
    value,
    root: value,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(true);
});

test(`Boolean - validationFn - should be true - success`, () => {
  const value = true;
  const schema: BooleanSchema = {
    type: "boolean",
    validationFn: (args) => {
      if (args.value) return;
      return { errorMessage: "Value should be true" };
    },
  };
  const result1 = validateBoolean({
    value,
    root: value,
    schema,
    parent: undefined as any,
    path: [],
  });
  expect(result1.isValid).toBe(true);

  const result2 = validate(value as any as Boolean, schema as any);
  expect(result2.isValid).toBe(true);
});

test(`Boolean - validationFn - should be true - failure`, () => {
  const value = false;
  const schema: BooleanSchema = {
    type: "boolean",
    validationFn: (args) => {
      if (args.value) return;
      return { errorMessage: "Value should be true" };
    },
  };
  const result1 = validateBoolean({
    value,
    root: value,
    schema,
    parent: undefined as any,
    path: [],
  });
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
