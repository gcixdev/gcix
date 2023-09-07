import { Pipeline } from "../../../../src";
import { CdkMirrorToCodecommit } from "../../../../src/aws";
import { check } from "../../../comparison";
let pipeline: Pipeline;

beforeEach(() => {
  pipeline = new Pipeline();
});

test("mirror job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new CdkMirrorToCodecommit({})],
  });
  check(pipeline.render(), expect);
});

test("mirror job configured", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CdkMirrorToCodecommit({
        repositoryName: "testrepo",
        infrastructureTags: "foo=bar,max=muster",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("mirror job with awsRegion", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CdkMirrorToCodecommit({
        awsRegion: "eu-west-1",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("mirror job with mirrorOpts", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new CdkMirrorToCodecommit({
        mirrorOpts: {
          remoteRepository: "https://gitlab.com/gcix/gcix",
          gitConfigUserEmail: "gcix@example.com",
          gitConfigUserName: "gcix",
          privateKeyVariable: "MyPrivateKeyVar",
        },
      }),
    ],
  });
  check(pipeline.render(), expect);
});
