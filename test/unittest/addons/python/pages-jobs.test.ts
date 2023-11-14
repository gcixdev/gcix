import { Pipeline } from "../../../../src";
import { PagesSphinx, PagesPdoc3 } from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("pdoc3", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new PagesPdoc3({ module: "gcip" }),
      new PagesPdoc3({
        module: "userdoc",
        outputPath: "/user",
        jobName: "userdoc",
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("sphinx", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new PagesSphinx({})],
  });
  check(pipeline.render(), expect);
});
