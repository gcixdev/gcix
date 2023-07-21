import {
  Pipeline,
  JobCollection,
  Job,
  PredefinedVariables,
  Artifacts,
} from "./src";

const pipeline = new Pipeline();

const lintJob = new Job({
  scripts: ["npx projen eslint"],
  name: "lint",
  stage: "test",
});
const testJob = new Job({
  scripts: ["npx projen test"],
  name: "test-jest",
  stage: "test",
});
testJob.assignArtifacts(
  new Artifacts({
    reports: [{ reportType: "junit", file: "test-reports/junit.xml" }],
  }),
);
const compileJob = new Job({
  scripts: [
    "npx projen pre-compile",
    "npx projen compile",
    "npx projen post-compile",
  ],
  name: "jsii-compile",
  stage: "compile",
});
compileJob.assignArtifacts(
  new Artifacts({ paths: ["tsconfig.json", ".jsii", "lib", "API.md"] }),
);

const testCollection = new JobCollection();
testCollection.addChildren({
  jobsOrJobCollections: [lintJob, testJob, compileJob],
});
testCollection.initializeImage("node:18");
testCollection.prependScripts(["npx projen install:ci"]);

const packageJsJob = new Job({
  scripts: ["npx projen package:js"],
  name: "package-js",
  stage: "package",
});
packageJsJob.assignImage("node:18");
packageJsJob.addNeeds([compileJob]);
const packagePythonJob = new Job({
  scripts: ["npx projen package:python"],
  name: "package-python",
  stage: "package",
});
packagePythonJob.assignImage("python:3");
packagePythonJob.addNeeds([compileJob]);

const packageCollection = new JobCollection();
packageCollection.addChildren({
  jobsOrJobCollections: [packageJsJob, packagePythonJob],
});
packageCollection.prependScripts(["npx projen install:ci"]);

pipeline.addChildren({
  jobsOrJobCollections: [testCollection, packageCollection],
});

const npmPublish = new Job({
  scripts: ["npm publish dist/js/*"],
  image: "node:18",
  name: "npm",
  stage: "publish",
});
const pypiPublish = new Job({
  scripts: ["pip install twine", "twine upload dist/python/*"],
  image: "python:3",
  name: "pypi",
  stage: "publish",
});
const publishCollection = new JobCollection();
publishCollection.addChildren({
  jobsOrJobCollections: [npmPublish, pypiPublish],
});

/**
 * Only add publishCollection if pipeline is running on a tag.
 */
if (PredefinedVariables.ciCommitTag) {
  pipeline.addChildren({
    jobsOrJobCollections: [publishCollection],
  });
}

pipeline.writeYaml();
