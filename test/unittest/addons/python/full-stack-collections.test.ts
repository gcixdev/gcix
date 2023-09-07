import { Pipeline } from "../../../../src";
import { PythonFullStack } from "../../../../src/python";
import { check } from "../../../comparison";

let pipeline: Pipeline;

beforeEach(() => {
  pipeline = new Pipeline();
});

test("simple", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new PythonFullStack({
        twineDevJobProps: {
          twineRepositoryUrl: "https://my.artifactory.net/pypi/dev-repository",
          twineUsernameEnvVar: "ARTIFACTORY_DEV_USER",
          twinePasswordEnvVar: "ARTIFACTORY_DEV_PASSWORD",
        },
        twineProdJobProps: {
          twineRepositoryUrl: "https://my.artifactory.net/pypi/prod-repository",
          twineUsernameEnvVar: "ARTIFACTORY_PROD_USER",
          twinePasswordEnvVar: "ARTIFACTORY_PROD_PASSWORD",
        },
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("with mypy", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new PythonFullStack({
        twineDevJobProps: {
          twineRepositoryUrl: "https://my.artifactory.net/pypi/dev-repository",
          twineUsernameEnvVar: "ARTIFACTORY_DEV_USER",
          twinePasswordEnvVar: "ARTIFACTORY_DEV_PASSWORD",
        },
        twineProdJobProps: {
          twineRepositoryUrl: "https://my.artifactory.net/pypi/prod-repository",
          twineUsernameEnvVar: "ARTIFACTORY_PROD_USER",
          twinePasswordEnvVar: "ARTIFACTORY_PROD_PASSWORD",
        },
        mypyJobProps: {
          packageDir: "test_package_dir",
        },
      }),
    ],
  });
  check(pipeline.render(), expect);
});

test("with custom evaluate git tag pep440 conformity image", () => {
  const fullStack = new PythonFullStack({
    twineDevJobProps: {
      twineRepositoryUrl: "https://my.artifactory.net/pypi/dev-repository",
      twineUsernameEnvVar: "ARTIFACTORY_DEV_USER",
      twinePasswordEnvVar: "ARTIFACTORY_DEV_PASSWORD",
    },
    twineProdJobProps: {
      twineRepositoryUrl: "https://my.artifactory.net/pypi/prod-repository",
      twineUsernameEnvVar: "ARTIFACTORY_PROD_USER",
      twinePasswordEnvVar: "ARTIFACTORY_PROD_PASSWORD",
    },
    mypyJobProps: {
      packageDir: "test_package_dir",
    },
  });
  fullStack.evaluateGitTagPep440ConformityJob.assignImage("custom/image:1.2.3");
  if (fullStack.mypyJob) fullStack.mypyJob.myPyVersion = "1.2.3";
  pipeline.addChildren({ jobsOrJobCollections: [fullStack] });
  check(pipeline.render(), expect);
});

test("with sphinx", () => {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new PythonFullStack({
        twineDevJobProps: {
          twineRepositoryUrl: "https://my.artifactory.net/pypi/dev-repository",
          twineUsernameEnvVar: "ARTIFACTORY_DEV_USER",
          twinePasswordEnvVar: "ARTIFACTORY_DEV_PASSWORD",
        },
        twineProdJobProps: {
          twineRepositoryUrl: "https://my.artifactory.net/pypi/prod-repository",
          twineUsernameEnvVar: "ARTIFACTORY_PROD_USER",
          twinePasswordEnvVar: "ARTIFACTORY_PROD_PASSWORD",
        },
        sphinxPropsJobProps: {},
      }),
    ],
  });
  check(pipeline.render(), expect);
});
