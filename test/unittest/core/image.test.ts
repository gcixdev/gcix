import { Image } from "../../../src/";

test("image class only with image", () => {
  const image = new Image({
    name: "alpine:3",
  });
  expect(image.name).toBe("alpine:3");
  expect(image.entrypoint).toBe(undefined);
  expect(image.render()).toMatchObject({
    name: "alpine:3",
  });
});

test("image class with entrypoint", () => {
  const image = new Image({
    name: "alpine:3",
    entrypoint: ["/bin/sh", "-c", "cat", "/etc/os-release"],
  });
  expect(image.name).toBe("alpine:3");
  expect(image.entrypoint).toMatchObject([
    "/bin/sh",
    "-c",
    "cat",
    "/etc/os-release",
  ]);
  expect(image.render()).toMatchObject({
    name: "alpine:3",
    entrypoint: ["/bin/sh", "-c", "cat", "/etc/os-release"],
  });
});

describe("image with", () => {
  const image = new Image({ name: "busybox" });
  test("tag", () => {
    const imageWithTag = image.withTag("1.2.3");
    expect(imageWithTag.tag).toBe("1.2.3");
  });
  test("entrypoint", () => {
    const imageWithEntrypoint = image.withEntrypoint([
      "/bin/sh",
      "-c",
      'echo "Hello world!',
    ]);
    expect(imageWithEntrypoint.entrypoint).toEqual([
      "/bin/sh",
      "-c",
      'echo "Hello world!',
    ]);
  });
});

test("equality", () => {
  const imageToCompareTo = new Image({
    name: "busybox",
    entrypoint: ["/bin/bash", "-c", "true"],
    tag: "latest",
  });
  const imageEqualsToCompareTo = new Image({
    name: "busybox",
    entrypoint: ["/bin/bash", "-c", "true"],
    tag: "latest",
  });
  const imageNotEqualsToCompareTo = new Image({
    name: "busybox",
    entrypoint: ["/bin/bash", "-c", "true"],
    tag: "v1.1.1",
  });

  expect(imageToCompareTo.isEqual(imageEqualsToCompareTo)).toBe(true);
  expect(imageToCompareTo.isEqual(imageNotEqualsToCompareTo)).toBe(false);
});
