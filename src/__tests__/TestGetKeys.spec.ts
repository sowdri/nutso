import { getKeys } from "../utils/getKeys";

test(`Basic obj`, () => {
  expect(getKeys({ foo: "bar" })).toStrictEqual(["foo"]);
});

test(`Empty object`, () => {
  expect(getKeys({})).toStrictEqual([]);
});
