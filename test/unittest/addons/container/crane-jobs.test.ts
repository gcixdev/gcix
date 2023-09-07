import { Pipeline, Image } from "../../../../src";
import {
  Registry,
  CraneCopy,
  CranePush,
  CranePull,
  DockerClientConfig,
} from "../../../../src/container";
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
      new CraneCopy({
        srcRegistry: "index.docker.io/alpine:3",
        dstRegistry: "index.docker.io/user/alpine:3",
      }),
    ],
    name: "default",
  });

  pipeline.addChildren({
    jobsOrJobCollections: [
      new CraneCopy({
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
      new CraneCopy({
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
      new CraneCopy({
        srcRegistry: Registry.QUAY,
        dstRegistry: Registry.GCR,
        jobName: "changed_name",
        jobStage: "changed_stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("simple crane push job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePush({
        dstRegistry: "index.docker.io",
      }),
    ],
    name: "push_image",
  });
  check(pipeline.render(), expect);
});

test("advanced crane push job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePush({
        dstRegistry: "index.docker.io",
        imageName: "crane",
        dockerClientConfig: dockerClientConfig,
      }).assignImage("crane_image:v1.1.2"),
    ],
    name: "push_image",
  });
  check(pipeline.render(), expect);
});

test("crane push on main", () => {
  jest.replaceProperty(process.env, "CI_COMMIT_REF_SLUG", "main");
  jest.replaceProperty(process.env, "CI_COMMIT_TAG", undefined);
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePush({
        dstRegistry: Registry.DOCKER,
      }),
    ],
    name: "push_image_with_latest_tag",
  });
  check(pipeline.render(), expect);
});

test("addons container jobs crane push registry", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePush({
        dstRegistry: Registry.DOCKER,
        imageName: "crane",
        dockerClientConfig: dockerClientConfig,
      }).assignImage("crane_image:v1.1.2"),
    ],
    name: "push_image",
  });
  check(pipeline.render(), expect);
});

test("crane push props", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePush({
        dstRegistry: Registry.QUAY,
        tarPath: "custom/tar/path",
        imageTag: "feature-1.2.3",
        jobName: "changed_name",
        jobStage: "changed_stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("crane simple pull", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePull({
        srcRegistry: Registry.GCR,
        imageName: "awesome/image",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("crane advanced pull", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePull({
        srcRegistry: Registry.GCR,
        dockerClientConfig: dockerClientConfig,
        imageName: "gcix/gcix",
        imageTag: "main",
        tarPath: "test/foo/bar",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("crane pull props", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CranePull({
        srcRegistry: Registry.QUAY,
        imageTag: "feature-1.2.3",
        jobName: "changed_name",
        jobStage: "changed_stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});
