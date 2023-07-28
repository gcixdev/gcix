import { Job, Pipeline } from "../../../src";

export function jobFor(environment: string): Job {
  return new Job({
    stage: "do_something",
    scripts: [`./do-something-on.sh ${environment}`],
  });
}

test("test", () => {
  const pipeline = new Pipeline();
  for (const env of ["development", "test"]) {
    pipeline.addChildren({ jobsOrJobCollections: [jobFor(env)] });
  }
  expect(() => {
    pipeline.render();
  }).toThrowError(/Two jobs have the same name/);
});
