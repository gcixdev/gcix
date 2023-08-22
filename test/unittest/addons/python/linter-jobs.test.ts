import { Pipeline } from "../../../../src/";
import { Flake8, MyPy, Isort } from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

describe("flake8", () => {
  test("default", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [new Flake8({})],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new Flake8({
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
      jobsOrJobCollections: [new MyPy({ packageDir: "src" })],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new MyPy({
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
      jobsOrJobCollections: [new Isort({})],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new Isort({
          jobName: "changed-properties",
          jobStage: "after-lint",
        }),
      ],
      name: "linter",
    });
    check(pipeline.render(), expect);
  });
});
