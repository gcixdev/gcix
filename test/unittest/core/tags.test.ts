import { Pipeline, Job } from "../../../src";
import { check } from "../../comparison";

let pipeline: Pipeline;
let testJob: Job;
beforeEach(() => {
  pipeline = new Pipeline();
  testJob = new Job({ stage: "testjob", scripts: ["foobar"] });
});

test("init_empty_tags", () => {
  pipeline.initializeTags(["foo", "bar"]);
  pipeline.addChildren({ jobsOrJobCollections: [testJob] });
  check(pipeline.render(), expect);
});

test("init_non_empty_tags", () => {
  pipeline.initializeTags(["foo", "bar"]);
  testJob.addTags(["keep", "those", "tags"]);
  pipeline.addChildren({ jobsOrJobCollections: [testJob] });
  check(pipeline.render(), expect);
});

test("override_tags", () => {
  pipeline.overrideTags(["new", "values"]);
  testJob.addTags(["replace", "those", "tags"]);
  pipeline.addChildren({ jobsOrJobCollections: [testJob] });
  check(pipeline.render(), expect);
});
