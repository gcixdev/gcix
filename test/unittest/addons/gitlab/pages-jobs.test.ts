import { Pipeline } from "../../../../src";
import { PagesAsciiDoctor } from "../../../../src/gitlab";
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
