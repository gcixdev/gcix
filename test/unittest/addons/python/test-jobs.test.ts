import { Pipeline } from "../../../../src";
import { EvaluateGitTagPep440Conformity, Pytest } from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;

beforeEach(() => {
  pipeline = new Pipeline();
});

test("simple pytest", () => {
  pipeline.addChildren({ jobsOrJobCollections: [new Pytest({})] });
  check(pipeline.render(), expect);
});

test("advanced pytest", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Pytest({
        jobName: "custom_name",
        jobStage: "custom_stage",
        pipenvVersionSpecifier: "==1.2.3",
        pytestCommand: "pytest --coverage html",
      }),
    ],
  });
  check(pipeline.render(), expect);
});
