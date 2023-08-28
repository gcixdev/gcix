import { PredefinedImages } from "../../../../src/container";

test.each([
  [
    PredefinedImages.KANIKO,
    { name: "gcr.io/kaniko-project/executor", tag: "debug", entrypoint: [""] },
  ],
  [
    PredefinedImages.CRANE,
    {
      name: "gcr.io/go-containerregistry/crane",
      tag: "debug",
      entrypoint: [""],
    },
  ],
  [
    PredefinedImages.DIVE,
    { name: "wagoodman/dive", tag: "latest", entrypoint: [""] },
  ],
  [PredefinedImages.GCIP, { name: "thomass/gcip", tag: "latest" }],
  [
    PredefinedImages.TRIVY,
    { name: "aquasec/trivy", tag: "latest", entrypoint: [""] },
  ],
  [PredefinedImages.BUSYBOX, { name: "busybox", tag: "latest" }],
  [
    PredefinedImages.ALPINE_GIT,
    { name: "alpine/git", tag: "latest", entrypoint: [""] },
  ],
  [
    PredefinedImages.GCIX,
    { name: "gcix/gcix", tag: "latest", entrypoint: [""] },
  ],
])("container images", (predefinedImage, expected) => {
  expect(predefinedImage).toEqual(expected);
});

test("image with tag", () => {
  expect(PredefinedImages.GCIP.withTag("otherThanLatest").tag).toBe(
    "otherThanLatest",
  );
  expect(PredefinedImages.GCIP.tag).toBe("latest");
});
test("image with entrypoint", () => {
  expect(
    PredefinedImages.GCIP.withEntrypoint(["foo", "bar"]).entrypoint,
  ).toEqual(["foo", "bar"]);
  expect(PredefinedImages.GCIP.entrypoint).toBeUndefined();
});
