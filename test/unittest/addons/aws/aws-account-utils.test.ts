import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { AWSAccount } from "../../../../src/aws";

const OLD_ENV = process.env;
let stsMock: any;
beforeEach(() => {
  stsMock = mockClient(STSClient);
  // Get rid of AWSAccount.callerIdentity to disable caching
  // of the caller identity inside the module.
  if (AWSAccount._callerIdentity)
    jest.replaceProperty(AWSAccount, "_callerIdentity", undefined);
  process.env = { ...OLD_ENV };
});

describe("AWSAccountId", () => {
  test("from environment variable", async () => {
    /**
     * Replace AWS_ACCOUNT_ID environment variable with a static value,
     * to test the environment variable AWS_ACCOUNT_ID.
     */
    process.env.AWS_ACCOUNT_ID = "01234567890-env";
    expect(await AWSAccount.awsAccountId()).toBe("01234567890-env");
  });

  test("from GetCallerIdentityCommand response", async () => {
    stsMock
      .on(GetCallerIdentityCommand)
      .resolvesOnce({ Account: "01234567890-mock" });
    // Mock STSClient to return the AWS account id from GetCallerIdentityCommand.
    expect(await AWSAccount.awsAccountId()).toBe("01234567890-mock");
  });

  test("throw an error when AWS Account ID cannot be resolved", async () => {
    // Mock the send function to throw an error
    await expect(AWSAccount.awsAccountId()).rejects.toThrow(
      "AWS Account ID not resolvable!",
    );
  });
});

describe("AWSRegion", () => {
  test("from environment variable", async () => {
    process.env.AWS_DEFAULT_REGION = "eu-foobar-1";
    expect(await AWSAccount.awsRegion()).toBe("eu-foobar-1");
  });

  test("from sts client", async () => {
    stsMock
      .on(GetCallerIdentityCommand)
      .resolvesOnce({ Arn: "arn::sts:eu-foobar-1:01234567890:iam/resource" });
    expect(await AWSAccount.awsRegion()).toBe("eu-foobar-1");
  });

  test("throw an error when AWS Region cannot be resolved", async () => {
    await expect(AWSAccount.awsRegion()).rejects.toThrow(
      "AWS Region not resolvable!",
    );
  });
});
