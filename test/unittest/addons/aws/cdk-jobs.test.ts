import { Bootstrap } from "../../../../src/addons/aws/jobs";
import { Pipeline } from "../../../../src/core";
import { check } from "../../../comparison";

test("bootstrap", () => {
  const pipeline = new Pipeline();
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
