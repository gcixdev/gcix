import {
  Rule,
  WhenStatement,
  Pipeline,
  Job,
  JobCollection,
} from "../../../src";
import { check } from "../../comparison";

let pipeline: Pipeline;
let jobFoo: Job;
let jobBar: Job;
beforeEach(() => {
  pipeline = new Pipeline();
  jobFoo = new Job({ name: "foo", scripts: ["foo"] });
  jobBar = new Job({ name: "bar", scripts: ["bar"] });
});

test("arguments", () => {
  jobFoo.appendRules([
    new Rule({
      ifStatement: "true",
      when: WhenStatement.ONFAILURE,
      allowFailure: true,
      changes: ["file1", "file2"],
      exists: ["file3"],
      variables: {
        MY: "value",
      },
    }),
  ]);
  pipeline.addChildren({ jobsOrJobCollections: [jobFoo] });
  check(pipeline.render(), expect);
});

test("rule order", () => {
  const collection = new JobCollection();
  collection.prependRules([new Rule({ ifStatement: "1" })]);
  collection.appendRules([new Rule({ ifStatement: "2" })]);

  const job = new Job({ stage: "testjob", scripts: ["foo"] });
  collection.addChildren({ jobsOrJobCollections: [job] });

  job.appendRules([
    new Rule({ ifStatement: "a" }),
    new Rule({ ifStatement: "b" }),
  ]);
  job.prependRules([
    new Rule({ ifStatement: "c" }),
    new Rule({ ifStatement: "d" }),
  ]);

  collection.appendRules([new Rule({ ifStatement: "3" })]);
  collection.prependRules([new Rule({ ifStatement: "4" })]);

  job.appendRules([
    new Rule({ ifStatement: "e" }),
    new Rule({ ifStatement: "f" }),
  ]);
  job.prependRules([
    new Rule({ ifStatement: "g" }),
    new Rule({ ifStatement: "h" }),
  ]);

  collection.appendRules([new Rule({ ifStatement: "5" })]);
  collection.prependRules([new Rule({ ifStatement: "6" })]);

  pipeline.addChildren({ jobsOrJobCollections: [collection] });

  check(pipeline.render(), expect);
});

test("init empty rules", () => {
  pipeline.addChildren({ jobsOrJobCollections: [jobFoo] });
  pipeline.initializeRules([
    new Rule({ ifStatement: "foo" }),
    new Rule({ ifStatement: "bar" }),
  ]);
  check(pipeline.render(), expect);
});

test("init non empty rules", () => {
  pipeline.addChildren({ jobsOrJobCollections: [jobFoo] });
  pipeline.initializeRules([
    new Rule({ ifStatement: "foo" }),
    new Rule({ ifStatement: "bar" }),
  ]);
  jobFoo.appendRules([
    new Rule({ ifStatement: "keep" }),
    new Rule({ ifStatement: "those" }),
    new Rule({ ifStatement: "rules" }),
  ]);
  check(pipeline.render(), expect);
});

test("override rules", () => {
  pipeline.addChildren({ jobsOrJobCollections: [jobFoo] });
  pipeline.overrideRules([
    new Rule({ ifStatement: "new" }),
    new Rule({ ifStatement: "values" }),
  ]);
  jobFoo.appendRules([
    new Rule({ ifStatement: "replace" }),
    new Rule({ ifStatement: "those" }),
    new Rule({ ifStatement: "rules" }),
  ]);
  check(pipeline.render(), expect);
});

test("never", () => {
  pipeline.addChildren({ jobsOrJobCollections: [jobFoo, jobBar] });
  const rule = new Rule({ ifStatement: "new" });
  const ruleNever = rule.never();

  jobFoo.appendRules([rule]);
  jobBar.appendRules([ruleNever]);

  expect(rule.when).toBe(WhenStatement.ONSUCCESS);
  expect(ruleNever.when).toBe(WhenStatement.NEVER);
  check(pipeline.render(), expect);
});

test("variables", () => {
  pipeline.addChildren({ jobsOrJobCollections: [jobFoo] });
  const rule = new Rule({ ifStatement: "true" });
  rule.addVariables({ TEST: "works", FOO: "bar" });
  jobFoo.appendRules([rule]);
  check(pipeline.render(), expect);
});

test("equality", () => {
  const ruleToCompareTo = new Rule({
    ifStatement: "true",
    allowFailure: false,
    changes: ["file1", "file2"],
    exists: ["exists1"],
    when: WhenStatement.MANUAL,
    variables: { FOO: "bar", BAZ: "soos" },
  });
  const ruleEqualsAsCompareTo = new Rule({
    ifStatement: "true",
    allowFailure: false,
    changes: ["file1", "file2"],
    exists: ["exists1"],
    when: WhenStatement.MANUAL,
    variables: { FOO: "bar", BAZ: "soos" },
  });
  const ruleNotEqualsAsCompareTo = new Rule({
    ifStatement: "false",
    allowFailure: false,
    changes: ["file1", "file2"],
    exists: ["exists1"],
    when: WhenStatement.MANUAL,
    variables: { FOO: "bar", BAZ: "soos" },
  });
  expect(ruleToCompareTo.isEqual(ruleEqualsAsCompareTo)).toBe(true);
  expect(ruleToCompareTo.isEqual(ruleNotEqualsAsCompareTo)).toBe(false);
});
