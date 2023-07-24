import {
  Pipeline,
  JobCollection,
  Job,
  PredefinedVariables,
  Artifacts,
} from "./src";

const pipeline = new Pipeline();

const lintJob = new Job({
  scripts: ["npx projen ci:lint"],
  name: "lint",
  stage: "test",
});
const testJob = new Job({
  scripts: ["npx projen ci:test"],
  artifacts: new Artifacts({
    reports: [{ reportType: "junit", file: "test-reports/junit.xml" }],
  }),
  name: "jest",
  stage: "test",
});
const testCollection = new JobCollection();
testCollection.addChildren({
  jobsOrJobCollections: [lintJob, testJob],
});

pipeline.addChildren({
  jobsOrJobCollections: [testCollection],
});

if (
  PredefinedVariables.ciCommitBranch === PredefinedVariables.ciDefaultBranch
) {
  pipeline.addChildren({
    jobsOrJobCollections: [
      new Job({
        scripts: [
          "npx projen ci:setup:git",
          `cd ${PredefinedVariables.ciCommitShortSha}`,
          "npx projen ci:publish:git",
        ],
        artifacts: new Artifacts({
          paths: ["lib", ".jsii", "tsconfig.json", "dist/"],
        }),
        name: "publish-git",
        stage: "publish",
      }),
    ],
  });
}

/**
 * Only add publishCollection if pipeline is running on a tag.
 */
if (PredefinedVariables.ciCommitTag) {
  const packageJob = new Job({
    scripts: ["npx projen ci:package-all"],
    name: "package",
    stage: "package",
    artifacts: new Artifacts({
      paths: ["lib", ".jsii", "tsconfig.json", "dist/"],
    }),
  });
  const publishJob = new Job({
    scripts: ["npx projen ci:publish-all"],
    name: "npm",
    stage: "publish",
  }).addNeeds([packageJob]);

  pipeline.addChildren({
    jobsOrJobCollections: [packageJob, publishJob],
  });
}

pipeline.initializeImage("node:18");
pipeline.addTags(["gcix"]);
pipeline.writeYaml();
