import { Pipeline, Image } from "../../../../src";
import { Registry, Copy, DockerClientConfig } from "../../../../src/container";
import { check } from "../../../comparison";

let pipeline: Pipeline;
let dockerClientConfig: DockerClientConfig;
const OLD_ENV = process.env;

beforeEach(() => {
  pipeline = new Pipeline();
  dockerClientConfig = new DockerClientConfig();
  dockerClientConfig.addAuth("index.docker.io");
  dockerClientConfig.addCredHelper(
    "0132456789.dkr.eu-central-1.amazonaws.com",
    "ecr-login",
  );
  process.env = { ...OLD_ENV };
});

test("simple crane copy job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Copy({
        srcRegistry: "index.docker.io/alpine:3",
        dstRegistry: "index.docker.io/user/alpine:3",
      }),
    ],
    name: "default",
  });

  pipeline.addChildren({
    jobsOrJobCollections: [
      new Copy({
        srcRegistry: "quay.io/wagoodman/dive:0.10.0",
        dstRegistry: "index.docker.io/user/dive:latest",
      }).assignImage(new Image({ name: "index.docker.io/user/crane:latest" })),
    ],
    name: "custom_image",
  });
  check(pipeline.render(), expect);
});

test("advanced crane copy job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Copy({
        srcRegistry: "index.docker.io/alpine:3",
        dstRegistry:
          "0132456789.dkr.eu-central-1.amazonaws.com/namespace/alpine:3",
        dockerClientConfig: dockerClientConfig,
      }),
    ],
    name: "with_authentication",
  });
  check(pipeline.render(), expect);
});

test("crane copy props", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Copy({
        srcRegistry: Registry.QUAY,
        dstRegistry: Registry.GCR,
        jobName: "changed_name",
        jobStage: "changed_stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});
