import { Job, Pipeline, PredefinedVariables } from "../../../src";
import { check } from "../../comparison";

let pipeline: Pipeline;
let testJob: Job;

beforeEach(() => {
  pipeline = new Pipeline();
  testJob = new Job({ stage: "testjob", scripts: ["foobar"] });
});

test("empty string if env CI is set", () => {
  process.env.CI = "false";
  expect(PredefinedVariables.ci).toBe("");
});

test("init_empty_variables", () => {
  pipeline.initializeVariables({ variable1: "foo", variable2: "bar" });
  pipeline.addChildren({ jobsOrJobCollections: [testJob] });
  check(pipeline.render(), expect);
});

test("init_non_empty_variables", () => {
  pipeline.initializeVariables({ variable1: "foo", variable2: "bar" });
  testJob.addVariables({
    variable1: "keep",
    variable2: "those",
    variable3: "variables",
  });
  pipeline.addChildren({ jobsOrJobCollections: [testJob] });
  check(pipeline.render(), expect);
});

test("override_variables", () => {
  pipeline.overrideVariables({ variable1: "new", variable2: "values" });
  testJob.addVariables({
    variable1: "replace",
    variable2: "those",
    variable3: "variables",
  });
  pipeline.addChildren({ jobsOrJobCollections: [testJob] });
  check(pipeline.render(), expect);
});

test("predefined_variables_in_pipeline_env", () => {
  process.env.CI = "true";
  expect(PredefinedVariables.ci).toBe("true");
  expect(PredefinedVariables.ciProjectName).toBe("gitlab-ci-project");
  expect(PredefinedVariables.ciCommitRefSlug).toBe("my-awsome-feature-branch");
});

test("predefined_variables_non_pipeline_env", () => {
  jest.replaceProperty(process, "env", { CI: undefined });
  // If env var CI is not set all EnvProxy varaibles returning
  // notRunningInAPipeline except if they are initialised by
  // the calling scope
  jest.replaceProperty(process, "env", { chatChannel: undefined });
  expect(PredefinedVariables.chatChannel).toBe("notRunningInAPipeline");
  jest.replaceProperty(process, "env", { ciCommitBranch: undefined });
  expect(PredefinedVariables.ciCommitBranch).toBe("notRunningInAPipeline");
});

test("sensitive_variables_are_unresolved", () => {
  expect(PredefinedVariables.ciDependencyProxyPassword).toBe(
    "${CI_DEPENDENCY_PROXY_PASSWORD}",
  );
  expect(PredefinedVariables.ciDeployPassword).toBe("${CI_DEPLOY_PASSWORD}");
  expect(PredefinedVariables.ciJobToken).toBe("${CI_JOB_TOKEN}");
  expect(PredefinedVariables.ciJobJwt).toBe("${CI_JOB_JWT}");
  expect(PredefinedVariables.ciRegistryPassword).toBe(
    "${CI_REGISTRY_PASSWORD}",
  );
  expect(PredefinedVariables.ciRepositoryUrl).toBe("${CI_REPOSITORY_URL}");
  expect(PredefinedVariables.ciRunnerShortToken).toBe(
    "${CI_RUNNER_SHORT_TOKEN}",
  );
});

describe("PredefinedVariables", () => {
  const staticProperties = Object.getOwnPropertyNames(
    PredefinedVariables,
  ) as (keyof typeof PredefinedVariables)[];
  const propertiesToExclude = [
    "name",
    "length",
    "prototype",
    "ciDependencyProxyPassword",
    "ciDeployPassword",
    "ciJobToken",
    "ciJobJwt",
    "ciRegistryPassword",
    "ciRepositoryUrl",
    "ciRunnerShortToken",
    "ci",
  ];
  const filteredProperties = staticProperties.filter(
    (propertyName) => !propertiesToExclude.includes(propertyName),
  );

  filteredProperties.forEach((propertyName) => {
    test(`should test property ${propertyName}`, () => {
      expect(PredefinedVariables[propertyName]).toBe("notRunningInAPipeline");
    });
  });
});
