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
const compileJob = new Job({
  scripts: [
    "npx projen pre-compile",
    "npx projen compile",
    "npx projen post-compile",
  ],
  artifacts: new Artifacts({
    paths: ["tsconfig.json", ".jsii", "lib", "API.md"],
  }),
  name: "jsii-compile",
  stage: "compile",
});
const testCollection = new JobCollection();
testCollection.addChildren({
  jobsOrJobCollections: [lintJob, testJob, compileJob],
});
testCollection.initializeImage("node:18");
testCollection.prependScripts(["npx projen install:ci"]);

const packageJob = new Job({
  scripts: [
    "apt update && apt install -y python3-pip python3-venv",
    "npx projen install:ci",
    "npx projen package-all",
  ],
  image: "node:18",
  artifacts: new Artifacts({ paths: ["dist/"] }),
  needs: [compileJob],
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
        scripts: ["npm publish dist/js/*"],
        name: "npm",
        stage: "publish",
      }),
      new Job({
        scripts: ["pip install twine", "twine upload dist/python/*"],
        name: "pypi",
        stage: "publish",
      }),
    ],
  });
}

pipeline.addTags(["gcix"]);
pipeline.writeYaml();
