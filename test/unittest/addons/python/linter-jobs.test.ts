import { Pipeline } from "../../../../src/";
import {
  PythonLintFlake8,
  PythonLintMyPy,
  PythonLintIsort,
} from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

describe("flake8", () => {
  test("default", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [new PythonLintFlake8({})],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new PythonLintFlake8({
          jobName: "changed-properties",
          jobStage: "after-lint",
        }),
      ],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
});

describe("mypy", () => {
  test("default", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [new PythonLintMyPy({ packageDir: "src" })],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new PythonLintMyPy({
          jobName: "changed-properties",
          jobStage: "after-lint",
          myPyOptions: "--custom-option True --another foobar",
          myPyVersion: "==1.2.3",
          packageDir: "src/foo",
        }),
      ],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
});

describe("isort", () => {
  test("default", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [new PythonLintIsort({})],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new PythonLintIsort({
          jobName: "changed-properties",
          jobStage: "after-lint",
        }),
      ],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
});
