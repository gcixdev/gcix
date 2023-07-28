import { Pipeline, Job, JobCollection } from "../../../src";
import { check } from "../../comparison";

test("test", () => {
  const sequence_a = new JobCollection();
  sequence_a.addChildren({
    jobsOrJobCollections: [new Job({ stage: "job1", scripts: ["script1.sh"] })],
  });
  sequence_a.prependScripts(["from-sequence.sh"]);

  const pipeline = new Pipeline();
  pipeline.addChildren({ jobsOrJobCollections: [sequence_a] });
  pipeline.addChildren({
    jobsOrJobCollections: [new Job({ stage: "job2", scripts: ["script2.sh"] })],
  });
  pipeline.prependScripts(["from-pipeline.sh"]);

  check(pipeline.render(), expect);
});
