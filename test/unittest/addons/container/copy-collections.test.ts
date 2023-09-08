import { Pipeline } from "../../../../src";
import {
  DockerClientConfig,
  Registry,
  CopyContainerCollection,
} from "../../../../src/container";
import { check } from "../../../comparison";

let pipeline: Pipeline;
let dcc: DockerClientConfig;
beforeEach(() => {
  pipeline = new Pipeline();
  dcc = new DockerClientConfig();
});

test("copy container", async () => {
  const awsRegistry = await Registry.aws({
    accountId: "1234567890123",
    region: "eu-central-1",
  });
  dcc.addAuth(Registry.DOCKER);
  dcc.addAuth(awsRegistry, "ecr-login");

  const cc = new CopyContainerCollection({
    srcRegistry: Registry.DOCKER,
    dstRegistry: awsRegistry,
    imageName: "gcix",
    imageTag: "0.10.0",
    dockerClientConfig: dcc,
  });
  cc.trivyScanLocalImageJob?.assignImage("custom/trivy:v1.2.3");

  pipeline.addChildren({ jobsOrJobCollections: [cc], stage: "container" });

  check(pipeline.render(), expect);
});

test("copy container without checks", () => {
  const cc = new CopyContainerCollection({
    srcRegistry: Registry.DOCKER,
    dstRegistry: Registry.QUAY,
    imageName: "busybox",
    imageTag: "latest",
    doDiveScan: false,
    doTrivyScan: false,
  });
  cc.cranePullJob.assignImage("custom/crane:1.2.1");
  cc.cranePushJob.assignImage("custom/crane:1.2.1");

  pipeline.addChildren({ jobsOrJobCollections: [cc] });

  check(pipeline.render(), expect);
});
