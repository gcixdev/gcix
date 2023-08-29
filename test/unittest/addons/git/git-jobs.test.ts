import { Pipeline } from "../../../../src";
import { Mirror } from "../../../../src/git";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("mirror job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Mirror({
        remoteRepository: "git@myrepo.com:company/gitlab-ci-python-library.git",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("mirror job configured", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Mirror({
        remoteRepository: "git@myrepo.com:company/gitlab-ci-python-library.git",
        gitConfigUserEmail: "max@muster.de",
        gitConfigUserName: "Max Power",
        privateKeyVariable: "TAKE_THAT",
        runOnlyForRepositoryUrl: "https://mycompay.net/gcip.git",
        scriptHook: ["a", "b"],
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("mirror job with change jobName and jobStage", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Mirror({
        remoteRepository: "github.com/gcix/gcix",
        jobName: "mirror",
        jobStage: "test",
      }),
    ],
  });
  check(pipeline.render(), expect);
});
