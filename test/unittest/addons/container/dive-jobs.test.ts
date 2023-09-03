// from gcip import Pipeline
// from tests import conftest
// from gcip.addons.container.jobs import dive

import { Pipeline } from "../../../../src";
import { Scan } from "../../../../src/container";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("default_dive_job", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new Scan({})],
    name: "default",
  });

  pipeline.addChildren({
    jobsOrJobCollections: [
      new Scan({ imagePath: "/absolute/path/", imageName: "image_name" }),
    ],
    name: "custom_image_and_path",
  });
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Scan({
        highestUserWastedPercent: 0.1,
        highestWastedBytes: 0.2,
        lowestEfficiency: 0.3,
        ignoreErrors: true,
        source: "podman",
        jobName: "custom_name",
        jobStage: "custom_stage",
      }),
    ],
    name: "custom_settings",
  });
  check(pipeline.render(), expect);
});

test("ensure throw error if out of boundaries", () => {
  expect(() => {
    new Scan({
      highestUserWastedPercent: 2,
    }).render();
  }).toThrowError("Argument is not between 0.0 and 1.0.");
});
