import { Pipeline } from "../../../../src";
import {
  PythonTestEvaluateGitTagPep440Conformity,
  PythonTestPytest,
} from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;

beforeEach(() => {
  pipeline = new Pipeline();
});

test("simple pytest", () => {
  pipeline.addChildren({ jobsOrJobCollections: [new PythonTestPytest({})] });
  check(pipeline.render(), expect);
});

test("advanced pytest", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new PythonTestPytest({
        jobName: "custom_name",
        jobStage: "custom_stage",
        pipenvVersionSpecifier: "==1.2.3",
        pytestCommand: "pytest --coverage html",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("simple EvaluateGitTagPep440Conformity", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new PythonTestEvaluateGitTagPep440Conformity({})],
  });
  check(pipeline.render(), expect);
});

test("advanced evaluategittagpep440conformity", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new PythonTestEvaluateGitTagPep440Conformity({
        jobName: "custom_name",
        jobStage: "custom_stage",
      }),
    ],
  });
  check(pipeline.render(), expect);
});
