import { Pipeline } from "../../../../src";
import { AsciiDoctor, Sphinx, Pdoc3 } from "../../../../src/gitlab";
import { check } from "../../../comparison";

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test("asciidoctor", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new AsciiDoctor({ source: "docs/index.adoc", outFile: "/index.html" }),
      new AsciiDoctor({
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
      new Pdoc3({ module: "gcip" }),
      new Pdoc3({ module: "userdoc", outputPath: "/user", jobName: "userdoc" }),
    ],
  });
  check(pipeline.render(), expect);
});

test("sphinx", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [new Sphinx({})],
  });
  check(pipeline.render(), expect);
});
