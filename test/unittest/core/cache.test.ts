import { Cache, CacheKey, CachePolicy, WhenStatement } from "../../../src";

// Begin testing cache policies enum
test("cache policies", () => {
  const expectedMembers = ["PULL", "PULLPUSH"];
  for (const member of expectedMembers) {
    expect(Object.keys(CachePolicy).includes(member)).toBeTruthy();
    // expect(Object.values(CachePolicy).includes(CachePolicy[member])).toBeTruthy();
  }
});

// Begin testing CacheKey Class
test("default cache key matches ci commit ref slug", () => {
  const cacheKey = new CacheKey({});
  expect(cacheKey.render()).toEqual({
    files: undefined,
    key: "my-awsome-feature-branch",
    prefix: undefined,
  });
  expect(cacheKey.key).toBe("my-awsome-feature-branch");
  expect(cacheKey.files).toBeUndefined();
  expect(cacheKey.prefix).toBeUndefined();
});

test("cache key with custom value", () => {
  const cacheKey = new CacheKey({ key: "mykey" });
  expect(cacheKey.render()).toEqual({
    files: undefined,
    key: "mykey",
    prefix: undefined,
  });
  expect(cacheKey.key).toBe("mykey");
  expect(cacheKey.files).toBeUndefined();
  expect(cacheKey.prefix).toBeUndefined();
});

test("cache key with files", () => {
  const cacheKey = new CacheKey({ files: ["filea", "fileb", "filec"] });
  expect(cacheKey.render()).toEqual({
    files: ["filea", "fileb", "filec"],
    key: undefined,
    prefix: undefined,
  });
  expect(cacheKey.key).toBeUndefined;
  expect(cacheKey.files).toEqual(["filea", "fileb", "filec"]);
  expect(cacheKey.prefix).toBeUndefined();
});

test("cache key files prefix", () => {
  const cacheKey = new CacheKey({
    files: ["filea", "fileb", "filec"],
    prefix: "myprefix",
  });
  expect(cacheKey.render()).toEqual({
    files: ["filea", "fileb", "filec"],
    key: undefined,
    prefix: "myprefix",
  });
  expect(cacheKey.key).toBeUndefined;
  expect(cacheKey.files).toEqual(["filea", "fileb", "filec"]);
  expect(cacheKey.prefix).toBe("myprefix");
});

test("cache key exceptions", () => {
  expect(() => {
    new CacheKey({ key: "mykey", files: ["filea", "fileb", "filec"] });
  }).toThrowError("Parameters key and files are mutually exclusive.");
  expect(() => {
    new CacheKey({ key: "mykey", prefix: "myprefix" });
  }).toThrow("Parameter 'prefix' can only be used together with 'files'.");
  expect(() => {
    new CacheKey({ prefix: "myprefix" });
  }).toThrow("Parameter 'prefix' can only be used together with 'files'.");
  expect(() => {
    new CacheKey({ prefix: "myprefix" });
  }).toThrow("Parameter 'prefix' can only be used together with 'files'.");
});

test("cache key equality", () => {
  const cacheKeyToCompareTo = new CacheKey({
    files: ["filea", "path/fileb", "/path/filec"],
    prefix: "foo",
  });
  const cacheKeyEqualsCompareTo = new CacheKey({
    files: ["filea", "path/fileb", "/path/filec"],
    prefix: "foo",
  });
  const cacheKeyNotEqualsCompareTo = new CacheKey({
    files: ["file1", "path/file2", "/path/file3"],
    prefix: "bar",
  });
  expect(cacheKeyToCompareTo.isEqual(cacheKeyEqualsCompareTo)).toBe(true);
  expect(cacheKeyToCompareTo.isEqual(cacheKeyNotEqualsCompareTo)).not.toBe(
    true,
  );
});

// Begin testing the actuall Cache class
test("simple cache initialization", () => {
  const cache = new Cache({ paths: ["path1", "path/two", "./path/three"] });
  expect(cache.render()).toEqual({
    key: "my-awsome-feature-branch",
    paths: ["./path1", "./path/two", "./path/three"],
    policy: undefined,
    untracked: undefined,
    when: undefined,
  });
  expect(cache.paths).toEqual(["./path1", "./path/two", "./path/three"]);
  expect(cache.policy).toBeUndefined();
  expect(cache.untracked).toBeUndefined();
  expect(cache.when).toBeUndefined();
});

test("advanced cache initialization", () => {
  const cache = new Cache({
    paths: ["path1", "path/two", "./path/three"],
    cacheKey: new CacheKey({ key: "mykey" }),
    untracked: true,
    when: WhenStatement.ONFAILURE,
    policy: CachePolicy.PULL,
  });
  expect(cache.render()).toEqual({
    key: "mykey",
    paths: ["./path1", "./path/two", "./path/three"],
    untracked: true,
    when: "on_failure",
    policy: "pull",
  });
  expect(cache.cacheKey.render()).toEqual({
    files: undefined,
    key: "mykey",
    prefix: undefined,
  });
  expect(cache.paths).toEqual(["./path1", "./path/two", "./path/three"]);
  expect(cache.policy).toBe("pull");
  expect(cache.untracked).toBeTruthy();
  expect(cache.when).toBe(WhenStatement.ONFAILURE);
});

test("cache exceptions", () => {
  expect(() => {
    new Cache({ paths: ["foo", "bar", "baz"], when: WhenStatement.MANUAL });
  }).toThrowError("manual is not allowed. Allowed when statements: ");
});

test("cache equality", () => {
  const cacheToCompareTo = new Cache({
    paths: ["foo", "bar"],
    cacheKey: new CacheKey({}),
    policy: CachePolicy.PULL,
    untracked: true,
    when: WhenStatement.ONSUCCESS,
  });
  const cacheEqualsCompareTo = new Cache({
    paths: ["foo", "bar"],
    cacheKey: new CacheKey({}),
    policy: CachePolicy.PULL,
    untracked: true,
    when: WhenStatement.ONSUCCESS,
  });
  const cacheNotEqualsCompareTo = new Cache({
    paths: ["baz"],
    cacheKey: new CacheKey({ key: "awsome" }),
    policy: CachePolicy.PULL,
    untracked: false,
    when: WhenStatement.ONFAILURE,
  });
  expect(cacheToCompareTo.isEqual(cacheEqualsCompareTo)).toBe(true);
  expect(cacheToCompareTo.isEqual(cacheNotEqualsCompareTo)).not.toBe(true);
});
