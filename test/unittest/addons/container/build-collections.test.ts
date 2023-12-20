import { Pipeline } from "../../../../src";
import {
  DockerClientConfig,
  Registry,
  BuildContainerCollection,
  BuildGitlabContainerCollection,
} from "../../../../src/container";
import { check } from "../../../comparison";

let pipeline: Pipeline;
let dcc: DockerClientConfig;
const OLD_ENV = process.env;
beforeEach(() => {
  pipeline = new Pipeline();
  dcc = new DockerClientConfig();
  process.env = { ...OLD_ENV };
});

test("build container collection", () => {
  dcc.addCredHelper(Registry.QUAY, "quay-login");
  pipeline.addChildren({
    jobsOrJobCollections: [
      new BuildContainerCollection({
        dockerClientConfig: dcc,
        registry: Registry.QUAY,
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("build container collection with customized jobs", () => {
  dcc.addAuth(Registry.DOCKER);
  const fcs = new BuildContainerCollection({
    registry: Registry.DOCKER,
    dockerClientConfig: dcc,
  });
  fcs.trivyScanLocalImageJob.assignImage("custom/trivy:v1.2.3");
  fcs.kanikoExecuteJob.buildArgs = { first_arg: "foo", second_arg: "bar" };
  pipeline.addChildren({ jobsOrJobCollections: [fcs] });
  check(pipeline.render(), expect);
});

test("build gitlab container collection", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new BuildGitlabContainerCollection({})],
  });
  check(pipeline.render(), expect);
});
