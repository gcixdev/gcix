import { Job, Pipeline } from "../../../src";
import { check } from "../../comparison";

test("test", () => {
  const pipeline = new Pipeline();
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Job({ name: "job1", stage: "single-stage", scripts: ["date"] }),
      new Job({ name: "job2", stage: "single-stage", scripts: ["date"] }),
    ],
  });

  check(pipeline.render(), expect);
});
