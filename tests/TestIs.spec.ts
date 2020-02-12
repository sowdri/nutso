import { isString, isNumber, isNil, isDate, isBoolean, isArray } from "../utils/is";

test(`Test isNil`, () => {
  expect(isNil(undefined)).toBe(true);
  expect(isNil(null)).toBe(true);
  expect(isNil(true)).toBe(false);
  expect(isNil(`foo`)).toBe(false);
  expect(isNil(1)).toBe(false);
  expect(isNil({})).toBe(false);
  expect(isNil(new Date())).toBe(false);
  expect(isNil([])).toBe(false);
});

test(`Test isString`, () => {
  expect(isString(`foo`)).toBe(true);
  expect(isString(undefined)).toBe(false);
  expect(isString(null)).toBe(false);
  expect(isString(true)).toBe(false);
  expect(isString(1)).toBe(false);
  expect(isString({})).toBe(false);
  expect(isString(new Date())).toBe(false);
  expect(isString([])).toBe(false);
});

test(`Test isNumber`, () => {
  expect(isNumber(`foo`)).toBe(false);
  expect(isNumber(undefined)).toBe(false);
  expect(isNumber(null)).toBe(false);
  expect(isNumber(true)).toBe(false);
  expect(isNumber(1)).toBe(true);
  expect(isNumber({})).toBe(false);
  expect(isNumber(new Date())).toBe(false);
  expect(isNumber([])).toBe(false);
});

test(`Test isDate`, () => {
  expect(isDate(undefined)).toBe(false);
  expect(isDate(null)).toBe(false);
  expect(isDate(true)).toBe(false);
  expect(isDate(`foo`)).toBe(false);
  expect(isDate(1)).toBe(false);
  expect(isDate({})).toBe(false);
  expect(isDate(new Date())).toBe(true);
  expect(isDate([])).toBe(false);
});

test(`Test isBoolean`, () => {
  expect(isBoolean(true)).toBe(true);
  expect(isBoolean(undefined)).toBe(false);
  expect(isBoolean(null)).toBe(false);
  expect(isBoolean(`foo`)).toBe(false);
  expect(isBoolean(1)).toBe(false);
  expect(isBoolean({})).toBe(false);
  expect(isBoolean(new Date())).toBe(false);
  expect(isBoolean([])).toBe(false);
});

test(`Test isArray`, () => {
  expect(isArray([])).toBe(true);
  expect(isArray(true)).toBe(false);
  expect(isArray(undefined)).toBe(false);
  expect(isArray(null)).toBe(false);
  expect(isArray(`foo`)).toBe(false);
  expect(isArray(1)).toBe(false);
  expect(isArray({})).toBe(false);
  expect(isArray(new Date())).toBe(false);
});
