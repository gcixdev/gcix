import { Registry } from "../../../../src/container";

test.each([
  [Registry.DOCKER, "index.docker.io"],
  [Registry.QUAY, "quay.io"],
  [Registry.GCR, "gcr.io"],
])("registries", (registry, expected) => {
  expect(registry).toBe(expected);
});

test("aws registry", async () => {
  process.env.AWS_ACCOUNT_ID = "123456789012";
  process.env.AWS_DEFAULT_REGION = "eu-central-1";
  expect(await Registry.aws()).toBe(
    "123456789012.dkr.ecr.eu-central-1.amazonaws.com",
  );
});

test("aws registry with props", async () => {
  expect(
    await Registry.aws({ accountId: "0123456789012", region: "us-east-1" }),
  ).toBe("0123456789012.dkr.ecr.us-east-1.amazonaws.com");
});
