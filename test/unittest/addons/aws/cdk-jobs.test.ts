import { Bootstrap, Diff } from "../../../../src/addons/aws/jobs";
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
