import { Bootstrap, Deploy, Diff } from "../../../../src/addons/aws/jobs";
import { Pipeline } from "../../../../src/core";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("bootstrap", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Bootstrap({
        awsAccountId: "1234567890",
        awsRegion: "net-wunderland-1",
        toolkitStackName: "my-cdk-toolkit-dev",
        qualifier: "beautifulapp",
      }),
    ],
    stage: "dev",
  });
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Bootstrap({
        jobName: "bootstrapTest",
        jobStage: "deployable",
        awsAccountId: "1234567890",
        awsRegion: "net-wunderland-1",
        toolkitStackName: "my-cdk-toolkit-tst",
        qualifier: "beautifulapp",
        resourceTags: {
          ApplicationName: "testapp",
          Subsystem: "testsystem",
        },
      }),
    ],
    stage: "tst",
  });
  check(pipeline.render(), expect);
});

test("cdk diff", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Diff({
        stacks: ["very-important-infrastructure", "another-stack"],
        context: {
          key1: "value1",
          key2: "value2",
        },
        diffOptions: "--ignore-errors --json",
        jobName: "stack-diff",
        jobStage: "test-stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("cdk deploy", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Deploy({
        stacks: ["very-important-infrastructure", "another-stack"],
        context: {
          key1: "value1",
          key2: "value2",
        },
        deployOptions: "--verbose --json",
        strict: true,
        toolkitStackName: "infra-toolkit-stack",
        waitForStack: true,
        waitForStackAccountId: "01234567890",
        waitForStackAssumeRole: "myAWSRole",
        jobName: "stack-deploy",
        jobStage: "deploy-stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("cdk deploy without strict and waitForStack", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Deploy({
        stacks: ["very-important-infrastructure", "another-stack"],
        context: {
          key1: "value1",
          key2: "value2",
        },
        deployOptions: "--verbose --json",
        strict: false,
        toolkitStackName: "infra-toolkit-stack",
        waitForStack: false,
        waitForStackAccountId: "01234567890",
        waitForStackAssumeRole: "myAWSRole",
        jobName: "stack-deploy",
        jobStage: "deploy-stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("cdk deploy warning", () => {
  const spyOn = jest.spyOn(console, "warn");
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Deploy({
        stacks: ["very-important-infrastructure", "another-stack"],
        waitForStack: true,
        waitForStackAccountId: "01234567890",
      }),
    ],
  });
  pipeline.render();

  expect(spyOn).toHaveBeenCalled();
  expect(spyOn).toBeCalledWith(
    "`waitForStackAccountId` has no effect without `waitForStackAssumeRole`",
  );
});
