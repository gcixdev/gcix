// eslint-disable-next-line import/no-extraneous-dependencies
import * as tmp from "tmp";
import {
  IncludeLocal,
  IncludeRemote,
  IncludeTemplate,
  Job,
  Pipeline,
  Service,
} from "../../../src";
import { check } from "../../comparison";

test("includes", () => {
  const firstInclude = new IncludeLocal({ local: "local-file.yml" });
  const secondInclude = new IncludeRemote({
    remote: "https://gitlab.com/my/project/include_file.yml",
  });
  const pipeline = new Pipeline({ includes: [firstInclude, secondInclude] });
  pipeline.addInclude(
    new IncludeTemplate({ template: "Template-Include-File.yml" }),
  );
  check(pipeline.render(), expect);
});

test("write yaml", () => {
  const pipeline = new Pipeline();
  pipeline.addChildren({
    jobsOrJobCollections: [new Job({ scripts: ["testjob"], stage: "test" })],
  });
  const targetTmpFile = tmp.fileSync();
  pipeline.writeYaml(targetTmpFile.name);
});

test("services", () => {
  const pipeline = new Pipeline();
  pipeline.addServices([
    new Service({ name: "foo" }),
    new Service({ name: "bar" }),
  ]);
  pipeline.addServices([new Service({ name: "baz" })]);
  check(pipeline.render(), expect);
});

test("exceptions", () => {
  const pipeline = new Pipeline();
  const job1 = new Job({ name: "foo", stage: "bar", scripts: ["true"] });
  const job2 = new Job({ name: "foo", stage: "bar", scripts: ["false"] });

  pipeline.addChildren({ jobsOrJobCollections: [job1, job2] });

  expect(() => {
    pipeline.render();
  }).toThrow(/Two jobs have the same name 'foo-bar' when/);
});
