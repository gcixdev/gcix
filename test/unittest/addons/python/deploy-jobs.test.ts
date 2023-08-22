import { Pipeline } from "../../../../src/";
import { TwineUpload } from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

describe("twine", () => {
  test("default", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [new TwineUpload({})],
      name: "deploy",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new TwineUpload({
          jobName: "changed-properties",
          jobStage: "after-deploy",
          twinePasswordEnvVar: "TWINE_CHANGED_PASSWORD",
          twineUsernameEnvVar: "TWINE_CHANGED_USERNAME",
          twineRepositoryUrl: "https://custom.pypi-repo.com",
        }),
      ],
      name: "deploy",
    });
    check(pipeline.render(), expect);
  });
});
