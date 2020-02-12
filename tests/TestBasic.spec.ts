import { nutso } from "../index";

test(`Basic`, () => {
  expect(nutso()).toMatchSnapshot();
});
