import { wrap } from "@/util/math";

test("Wrap works", () => {
  expect(wrap(3, 0, 10)).toBe(3);
  expect(wrap(0, 2, 10)).toBe(8);
  expect(wrap(0, 2, 8)).toBe(6);
  expect(wrap(1, -2, 8)).toBe(1);
  expect(wrap(-7, -2, 2)).toBe(1);
});
