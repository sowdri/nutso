import { Schema } from "../models/schema/Schema";
import { _validate } from "../validate/validate";

test(`Test simple array`, () => {
  type Colors = string[];
  const favColors: Colors = ["blue", "green"];
  const colorsSchema: Schema<Colors> = {
    type: "array",
    minItems: 3,
    maxItems: 10,
    items: {
      type: "string",
    },
  };
  expect(_validate(favColors, favColors, colorsSchema)).toMatchSnapshot();
});

test(`Test simple array values`, () => {
  type Colors = string[];
  const favColors: Colors = ["blue", "green"];
  const colorsSchema: Schema<Colors> = {
    type: "array",

    minItems: 3,
    maxItems: 10,
    items: {
      type: "string",
      minLength: 5, // blue will fail
    },
  };
  const result = _validate(favColors, favColors, colorsSchema);
  expect(result).toMatchSnapshot();
  expect(result.items[0].isValid).toBe(false);
});

test(`Test array is valid, but one item is not`, () => {
  type Colors = string[];
  const favColors: Colors = ["blue", "green", "black"];
  const colorsSchema: Schema<Colors> = {
    type: "array",
    minItems: 3,
    maxItems: 10,
    items: {
      type: "string",
      minLength: 5, // blue will fail
    },
  };
  const result = _validate(favColors, favColors, colorsSchema);
  expect(result).toMatchSnapshot();
  expect(result.items[0].isValid).toBe(false);
});
