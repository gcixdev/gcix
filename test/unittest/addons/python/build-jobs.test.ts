import { Pipeline } from "../../../../src";
import { PythonBuildBdistWheel } from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

describe("bdist wheel", () => {
  test("default", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [new PythonBuildBdistWheel({})],
      name: "build",
    });
    check(pipeline.render(), expect);
  });
  test("changed properties", () => {
    pipeline.addChildren({
      jobsOrJobCollections: [
        new PythonBuildBdistWheel({
          jobName: "changed-properties",
          jobStage: "after-build",
          pipRequirements: {
            pipenvVersionSpecifier: "==1.2.3",
            requirementsFile: "changed_requirements.txt",
          },
        }),
      ],
      name: "build",
    });
    check(pipeline.render(), expect);
  });
});
