import { OrderedStringSet } from "../../../src";
test("OrderedStringSet", () => {
  const orderedStringSet = new OrderedStringSet();

  // Test adding values
  orderedStringSet.add("foo");
  expect(orderedStringSet.size).toBe(1);
  expect(orderedStringSet.has("foo")).toBeTruthy();
  expect(orderedStringSet.values).toEqual(["foo"]);

  orderedStringSet.add("bar");
  expect(orderedStringSet.size).toBe(2);
  expect(orderedStringSet.has("bar")).toBeTruthy();
  expect(orderedStringSet.values).toEqual(["foo", "bar"]);

  orderedStringSet.add(["hello", "world"]);
  expect(orderedStringSet.has("world")).toBeTruthy();
  expect(orderedStringSet.size).toBe(4);
  expect(orderedStringSet.values).toEqual(["foo", "bar", "hello", "world"]);

  orderedStringSet.delete("hello");
  expect(orderedStringSet.has("hello")).not.toBeTruthy();
  expect(orderedStringSet.size).toBe(3);
  expect(orderedStringSet.values).toEqual(["foo", "bar", "world"]);

  orderedStringSet.clear();
  expect(orderedStringSet.size).toBe(0);
  expect(orderedStringSet.values).toEqual([]);
});

test("iterating over ordered string set", () => {
  const initValues = ["foo", "bar", "baz", "hello", "world"];
  const orderedStringSet = new OrderedStringSet(initValues);

  for (const value of orderedStringSet) {
    expect(initValues.includes(value)).toBeTruthy();
  }
});
