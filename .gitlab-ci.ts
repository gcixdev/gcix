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
  artifacts: new Artifacts({
    reports: [{ reportType: "junit", file: "test-reports/junit.xml" }],
  }),
  name: "test-jest",
  stage: "test",
});
const testCollection = new JobCollection();
testCollection.addChildren({
  jobsOrJobCollections: [lintJob, testJob],
});
testCollection.initializeImage("node:18");
testCollection.prependScripts(["npx projen install:ci"]);

const packageJob = new Job({
  scripts: ["npx projen ci:package"],
  image: "node:18",
  artifacts: new Artifacts({
    paths: ["lib", ".jsii", "tsconfig.json", "dist/"],
  }),
  name: "package-all",
  stage: "package",
});

pipeline.addChildren({
  jobsOrJobCollections: [testCollection, packageJob],
});

/**
 * Only add publishCollection if pipeline is running on a tag.
 */
if (PredefinedVariables.ciCommitTag) {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Job({
        scripts: ["npx projen ci:publish-npmjs"],
        name: "npm",
        stage: "publish",
      }).addNeeds([packageJob]),
      new Job({
        scripts: ["npx projen ci:publish-pypi"],
        name: "pypi",
        stage: "publish",
      }).addNeeds([packageJob]),
    ],
  });
}

pipeline.addTags(["gcix"]);
pipeline.writeYaml();
