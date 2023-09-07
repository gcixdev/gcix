import { Pipeline } from "../../../../src";
import {
  KanikoExecute,
  DockerClientConfig,
  Registry,
} from "../../../../src/container";
import { check } from "../../../comparison";

let pipeline: Pipeline;
let dcc: DockerClientConfig;
beforeEach(() => {
  pipeline = new Pipeline();
  dcc = new DockerClientConfig();
});

test("simple kaniko job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new KanikoExecute({})],
    name: "simple",
  });
  check(pipeline.render(), expect);
});

test("default kaniko job", () => {
  dcc.addAuth("index.docker.io", "DOCKER_USER", "DOCKER_LOGIN");
  pipeline.addChildren({
    jobsOrJobCollections: [
      new KanikoExecute({
        imageName: "gcix/gcix",
        enablePush: true,
        dockerClientConfig: dcc,
      }),
    ],
    name: "gcix",
  });
  check(pipeline.render(), expect);
});

test("container kaniko job docker v2 replacement", () => {
  dcc.addAuth(Registry.DOCKER);
  pipeline.addChildren({
    jobsOrJobCollections: [
      new KanikoExecute({
        imageName: "gcix/gcix",
        imageTag: "v2.2.2",
        dockerClientConfig: dcc,
      }),
    ],
    name: "gcix2",
  });
  check(pipeline.render(), expect);
});

test("container kaniko job tar path", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new KanikoExecute({ tarPath: "tar/path/for/image" }),
    ],
  });
  check(pipeline.render(), expect);
});
