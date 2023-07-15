import {
  Job,
  Pipeline,
  JobCollection,
  Rule,
  Cache,
  Image,
  Artifacts,
  CacheKey,
  WhenStatement,
} from "../../../src";
import { check } from "../../comparison";

test("name population", () => {
  const job = new Job({ name: "a", stage: "b", scripts: ["foobar"] });
  const collection1 = new JobCollection().addChildren({
    jobsOrJobCollections: [job],
    name: "c",
    stage: "d",
  });
  const collection2 = new JobCollection().addChildren({
    jobsOrJobCollections: [collection1],
    name: "e",
    stage: "f",
  });
  expect(collection2.populatedJobs[0].name).toBe("e-f-c-d-a-b");
});

test("initialize jobs", () => {
  const job = new Job({
    name: "foo",
    stage: "bar",
    scripts: ["test"],
    variables: { foo: "bar" },
    cache: new Cache({ paths: ["./cache/it"] }),
    artifacts: new Artifacts({ paths: ["take/that"] }),
    tags: ["foobar"],
    rules: [new Rule({ ifStatement: "thatworks" })],
    image: new Image({ name: "myimage" }),
    allowFailure: true,
  });

  const collection = new JobCollection().addChildren({
    jobsOrJobCollections: [job],
  });
  collection.initializeVariables({ wrong: "value" });
  collection.initializeArtifacts(new Artifacts({ paths: ["wrong"] }));
  collection.initializeCache(new Cache({ paths: ["wrong"] }));
  collection.initializeRules([new Rule({ ifStatement: "wrong" })]);
  collection.initializeTags(["wrong"]);
  collection.initializeImage("wrong");
  collection.initializeImage(new Image({ name: "noob" }));
  collection.initializeAllowFailure(false);

  const populatedJob = collection.populatedJobs[0];

  expect(populatedJob.variables).toEqual({ foo: "bar" });
  expect(populatedJob.artifacts!.paths[0]).toBe("take/that");
  expect(populatedJob.cache!.paths[0]).toBe("./cache/it");
  expect(populatedJob.rules![0].ifStatement).toBe("thatworks");
  expect(populatedJob.tags).toEqual(["foobar"]);
  expect(populatedJob.image!.name).toBe("myimage");
  expect(populatedJob.allowFailure).toBe(true);
});

test("initialize job collection", () => {
  const job = new Job({
    name: "foo",
    stage: "bar",
    scripts: ["test"],
  });

  const childCollection = new JobCollection().addChildren({
    jobsOrJobCollections: [job],
  });
  childCollection.initializeVariables({ foo: "bar" });
  childCollection.initializeArtifacts(new Artifacts({ paths: ["take/that"] }));
  childCollection.initializeCache(new Cache({ paths: ["./cache/it"] }));
  childCollection.initializeRules([new Rule({ ifStatement: "thatworks" })]);
  childCollection.initializeTags(["foobar"]);
  childCollection.initializeImage(new Image({ name: "myimage" }));
  childCollection.initializeAllowFailure(true);

  const collection = new JobCollection().addChildren({
    jobsOrJobCollections: [childCollection],
  });
  collection.initializeVariables({ wrong: "value" });
  collection.initializeArtifacts(new Artifacts({ paths: ["wrong"] }));
  collection.initializeCache(new Cache({ paths: ["wrong"] }));
  collection.initializeRules([new Rule({ ifStatement: "wrong" })]);
  collection.initializeTags(["wrong"]);
  collection.initializeImage("wrong");
  collection.initializeImage(new Image({ name: "noob" }));
  collection.initializeAllowFailure(false);

  const populatedJob = collection.populatedJobs[0];

  expect(populatedJob.variables).toEqual({ foo: "bar" });
  expect(populatedJob.artifacts!.paths[0]).toBe("take/that");
  expect(populatedJob.cache!.paths[0]).toBe("./cache/it");
  expect(populatedJob.rules![0].ifStatement).toBe("thatworks");
  expect(populatedJob.tags).toEqual(["foobar"]);
  expect(populatedJob.image!.name).toBe("myimage");
  expect(populatedJob.allowFailure).toBe(true);
});

test("initialize empty arrays", () => {
  const pipeline = new Pipeline();
  const job1 = new Job({ name: "job1", scripts: ["date"] });

  const collection = new JobCollection().addChildren({
    jobsOrJobCollections: [
      new Job({ name: "job2", scripts: ["date"] })
        .addDependencies([job1])
        .addNeeds([job1]),
      new Job({ name: "job3", scripts: ["date"] }),
    ],
  });

  pipeline.addChildren({
    jobsOrJobCollections: [
      job1,
      collection,
      new Job({ name: "job4", scripts: ["date"] })
        .addDependencies([job1])
        .addNeeds([job1]),
      new Job({ name: "job5", scripts: ["date"] }),
    ],
  });

  // TODO: Check why inititalize* is called empty
  pipeline.initializeDependencies([]);
  pipeline.initializeNeeds([]);
  check(pipeline.render(), expect);
});

describe("check methods", () => {
  let pipeline: Pipeline;
  let collection: JobCollection;
  let job1: Job;
  let job2: Job;
  let job3: Job;
  beforeEach(() => {
    pipeline = new Pipeline();
    collection = new JobCollection();
    job1 = new Job({
      name: "job1",
      scripts: ["echo job1"],
      allowFailure: false,
      tags: ["tag1", "tag2"],
    });
    job2 = new Job({
      name: "job2",
      scripts: ["echo job2"],
      cache: new Cache({ paths: ["to_cache.txt"] }),
    });
    job3 = new Job({
      name: "job3",
      scripts: ["echo job3"],
      rules: [new Rule({ ifStatement: '$FOO == "bar"' })],
      artifacts: new Artifacts({ paths: ["artifacts_file.txt"] }),
    });
    collection.addChildren({ jobsOrJobCollections: [job1, job2, job3] });
  });
  test("initialize methods", () => {
    collection.initializeAllowFailure([123]);
    collection.initializeArtifacts(
      new Artifacts({ paths: ["foobar.artifacts.txt"] }),
    );
    collection.initializeCache(new Cache({ paths: ["./image"] }));
    collection.initializeDependencies([job3]);
    collection.initializeNeeds([job2]);
    collection.initializeRules([
      new Rule({
        ifStatement: "false",
        variables: { FOO: "BAR", SOOS: "BAZ" },
      }),
    ]);
    collection.initializeRules([
      new Rule({ ifStatement: "true", variables: { ONE: "one", TWO: "two" } }),
    ]);
    collection.initializeTags(["init_tag", "init_tag_init", "init_tag"]);
    collection.initializeVariables({ ANY: "VARIABLE", TEST: "true" });
  });
  test("add methods", () => {
    collection.addDependencies([job3]);
    collection.addDependencies([job1]);
    collection.addNeeds([job2]);
    collection.addNeeds([job3]);
    collection.addTags(["init_tag", "init_tag_init", "init_tag"]);
    collection.addVariables({ ANY: "VARIABLE", TEST: "true" });
  });
  test("append methods", () => {
    collection.appendRules([
      new Rule({
        ifStatement: "false",
        variables: { FOO: "BAR", SOOS: "BAZ" },
      }),
    ]);
    collection.appendRules([
      new Rule({ ifStatement: "true", variables: { ONE: "one", TWO: "two" } }),
    ]);
    collection.appendScripts(["echo 'I am appended", "cat some_file.txt"]);
    collection.appendScripts(["echo 'Second append", "python script.py"]);
  });
  test("prepend methods", () => {
    collection.prependRules([
      new Rule({
        ifStatement: "false",
        variables: { FOO: "BAR", SOOS: "BAZ" },
      }),
    ]);
    collection.prependRules([
      new Rule({ ifStatement: "true", variables: { ONE: "one", TWO: "two" } }),
    ]);
    collection.prependScripts(["echo 'I am prepended'", "cat some_file.txt"]);
    collection.prependScripts(["echo 'Second prepend", "python script.py"]);
  });
  test("assign methods", () => {
    collection.assignArtifacts(
      new Artifacts({
        paths: ["i_did_overwrite_all_other_artifacts.txt"],
        reports: [{ reportType: "accessibility", file: "accessibility.txt" }],
      }),
    );
    collection.assignCache(
      new Cache({
        paths: ["dir_to_be_cached/"],
        cacheKey: new CacheKey({ key: "new-key" }),
      }),
    );
  });
  test("override methods", () => {
    collection.overrideAllowFailure([123, 321]);
    collection.overrideDependencies([job1]);
    collection.overrideImage("alpine:3");
    collection.overrideNeeds([job3]);
    collection.overrideRules([
      new Rule({
        allowFailure: true,
        changes: ["foo.txt", "bar.txt"],
        when: WhenStatement.MANUAL,
        ifStatement: '$DEBUG == "YES"',
      }),
      new Rule({ ifStatement: "$CI" }),
    ]);
    collection.overrideRules([
      new Rule({ ifStatement: "true", variables: { ONE: "one", TWO: "two" } }),
    ]);
    collection.overrideTags(["override1", "override2"]);
    collection.overrideVariables({ OVER: "ride1", RIDE: "over1" });
  });
  afterEach(() => {
    pipeline.addChildren({ jobsOrJobCollections: [collection] });
    check(pipeline.render(), expect);
  });
});

test("exceptions", () => {
  const pipeline = new Pipeline();
  const job1 = new Job({ scripts: ["script1"], name: "job1" });
  const job2 = new Job({ scripts: ["script2"], name: "job2", stage: "deploy" });
  job1.addDependencies([job2]);
  // @ts-ignore: Argument of type 'string' is not assignable to parameter of type '(JobCollection | Job | Need)[]'
  job2.addDependencies("foobar");
  pipeline.addChildren({ jobsOrJobCollections: [job1, job2] });
  expect(() => {
    pipeline.render();
  }).toThrowError(/Dependency '.*' is of type .*/);
});
