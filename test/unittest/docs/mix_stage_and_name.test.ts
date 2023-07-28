import { Job, Pipeline } from "../../../src";
import { check } from "../../comparison";

export function jobFor(service: string): Job {
  return new Job({
    stage: "update_service",
    scripts: [`./update-service.sh ${service}`],
  });
}

test("test", () => {
  const pipeline = new Pipeline();
  for (const env of ["development", "test"]) {
    for (const service of ["service1", "service2"]) {
      pipeline.addChildren({
        jobsOrJobCollections: [jobFor(`${service}_${env}`)],
        stage: env,
        name: service,
      });
    }
  }
  check(pipeline.render(), expect);
});
