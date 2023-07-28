import { Pipeline, Job, JobCollection } from "../../../src";
import { check } from "../../comparison";

test("test", () => {
  const collectionA = new JobCollection();
  collectionA.addChildren({
    jobsOrJobCollections: [new Job({ stage: "job1", scripts: ["script1.sh"] })],
  });
  collectionA.prependScripts(["from-sequence-a.sh"]);

  const collectionB = new JobCollection();
  collectionB.addChildren({ jobsOrJobCollections: [collectionA] });
  collectionB.addChildren({
    jobsOrJobCollections: [new Job({ stage: "job2", scripts: ["script2.sh"] })],
  });
  collectionB.prependScripts(["from-sequence-b.sh"]);

  const pipeline = new Pipeline();
  pipeline.addChildren({ jobsOrJobCollections: [collectionB] });

  check(pipeline.render(), expect);
});
