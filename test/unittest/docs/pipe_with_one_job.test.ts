import { Pipeline, Job } from "../../../src";
import { check } from "../../comparison";

test("test", () => {
  const pipeline = new Pipeline();
  pipeline.addChildren({
    jobsOrJobCollections: [new Job({ stage: "print_date", scripts: ["date"] })],
  });
  check(pipeline.render(), expect);
});
