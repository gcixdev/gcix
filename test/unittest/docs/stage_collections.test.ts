import { Pipeline, JobCollection, Job } from "../../../src";
import { check } from "../../comparison";

export function environmentPipeline(environment: string): JobCollection {
  const collection = new JobCollection();
  collection.addChildren({
    jobsOrJobCollections: [
      new Job({ stage: "job1", scripts: [`job-1-on-${environment}`] }),
      new Job({ stage: "job2", scripts: [`job-2-on-${environment}`] }),
    ],
  });
  return collection;
}

test("test", () => {
  const pipeline = new Pipeline();
  for (const env of ["development", "test"]) {
    pipeline.addChildren({
      jobsOrJobCollections: [environmentPipeline(env)],
      stage: env,
    });
  }
  check(pipeline.render(), expect);
});
