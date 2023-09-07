import { Pipeline } from "../../../../src";
import {
  PagesAsciiDoctor,
  PagesSphinx,
  PagesPdoc3,
} from "../../../../src/gitlab";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("asciidoctor", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new PagesAsciiDoctor({
        source: "docs/index.adoc",
        outFile: "/index.html",
      }),
      new PagesAsciiDoctor({
        source: "docs/awesome.adoc",
        outFile: "/awesome.html",
        jobName: "pages_awesome",
      }),
    ],
    name: "foo",
  });
  check(pipeline.render(), expect);
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
