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
  expect(PredefinedVariables.CI).toBe("");
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
  expect(PredefinedVariables.CI).toBe("true");
  expect(PredefinedVariables.CI_PROJECT_NAME).toBe("gitlab-ci-project");
});

test("predefined_variables_non_pipeline_env", () => {
  jest.replaceProperty(process, "env", { CI: undefined });
  // If env var CI is not set all EnvProxy varaibles returning
  // notRunningInAPipeline except if they are initialised by
  // the calling scope
  jest.replaceProperty(process, "env", { CHAT_CHANNEL: undefined });
  expect(PredefinedVariables.CHAT_CHANNEL).toBe("notRunningInAPipeline");
  jest.replaceProperty(process, "env", { CI_COMMIT_BRANCH: undefined });
  expect(PredefinedVariables.CI_COMMIT_BRANCH).toBe("notRunningInAPipeline");
});

test("sensitive_variables_are_unresolved", () => {
  expect(PredefinedVariables.CI_DEPENDENCY_PROXY_PASSWORD).toBe(
    "${CI_DEPENDENCY_PROXY_PASSWORD}",
  );
  expect(PredefinedVariables.CI_DEPLOY_PASSWORD).toBe("${CI_DEPLOY_PASSWORD}");
  expect(PredefinedVariables.CI_JOB_TOKEN).toBe("${CI_JOB_TOKEN}");
  expect(PredefinedVariables.CI_JOB_JWT).toBe("${CI_JOB_JWT}");
  expect(PredefinedVariables.CI_REGISTRY_PASSWORD).toBe(
    "${CI_REGISTRY_PASSWORD}",
  );
  expect(PredefinedVariables.CI_REPOSITORY_URL).toBe("${CI_REPOSITORY_URL}");
  expect(PredefinedVariables.CI_RUNNER_SHORT_TOKEN).toBe(
    "${CI_RUNNER_SHORT_TOKEN}",
  );
});
