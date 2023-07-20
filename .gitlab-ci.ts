import { Pipeline, JobCollection, Job, PredefinedVariables, Rule } from "./src";

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
const compileJob = new Job({
  scripts: [
    "npx projen pre-compile",
    "npx projen compile",
    "npx projen post-compile",
  ],
  name: "jsii-compile",
  stage: "build",
});
const packageJob = new Job({
  scripts: ["npx projen package-all"],
  name: "package-all",
  stage: "build",
});
const testCollection = new JobCollection();
testCollection.addChildren({
  jobsOrJobCollections: [lintJob, testJob, compileJob, packageJob],
});
testCollection.initializeImage("node:18");
testCollection.prependScripts(["npx projen install:ci"]);

pipeline.addChildren({
  jobsOrJobCollections: [testCollection],
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
