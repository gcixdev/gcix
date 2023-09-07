import { Pipeline } from "../../../../src";
import { DockerBuild, DockerPush } from "../../../../src/container";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("default docker jobs", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new DockerBuild({ repository: "myspace/myimage" }),
      new DockerPush({ containerImage: "myspace/myimage" }),
    ],
  });
  check(pipeline.render(), expect);
});
