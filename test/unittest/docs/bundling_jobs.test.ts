import * as gcix from "../../../src";
import { check } from "../../comparison";

test("test", () => {
  const collection = new gcix.JobCollection();

  const job1 = new gcix.Job({ stage: "job1", scripts: ["script1.sh"] });
  job1.prependScripts(["from-job-1.sh"]);

  collection.addChildren({
    jobsOrJobCollections: [
      job1,
      new gcix.Job({ stage: "job2", scripts: ["script2.sh"] }),
    ],
  });
  collection.prependScripts(["from-sequence.sh"]);

  const pipeline = new gcix.Pipeline();
  pipeline.addChildren({ jobsOrJobCollections: [collection] });

  check(pipeline.render(), expect);
});
