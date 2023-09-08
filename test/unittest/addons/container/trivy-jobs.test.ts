import { Pipeline } from "../../../../src";
import {
  TrivyScanLocalImage,
  TrivyIgnoreFileCheck,
} from "../../../../src/container";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("simple scan local image", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new TrivyScanLocalImage({})],
    name: "simple_scan",
  });
  check(pipeline.render(), expect);
});

test("advanced scan local image", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new TrivyScanLocalImage({
        imagePath: "/foo/bar/baz",
        imageName: "custom_image",
        outputFormat: "json",
        severity: "MEDIUM,HIGH,CRITICAL",
        trivyConfig: "--list-all-pkgs",
      }),
    ],
    name: "advanced_scan",
  });
  check(pipeline.render(), expect);
});

test("check trivyignore", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new TrivyIgnoreFileCheck({})],
  });
  check(pipeline.render(), expect);
});

test("check trivyignore path", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new TrivyIgnoreFileCheck({ trivyignorePath: `foo/bar/baz/.trivyignore` }),
    ],
  });
  check(pipeline.render(), expect);
});
