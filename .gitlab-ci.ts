import {
  Pipeline,
  JobCollection,
  Job,
  PredefinedVariables,
  Artifacts,
  PagesJob,
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
  const publishNpmJob = new Job({
    scripts: ["npx projen ci:publish:npm"],
    name: "npm",
    stage: "publish",
  }).addNeeds([packageJob]);

  const publishPyPiJob = new Job({
    scripts: ["npx projen ci:publish:pypi"],
    name: "pypi",
    stage: "publish",
  }).addNeeds([packageJob]);

  const mikePagesJob = new PagesJob();
  mikePagesJob.appendScripts([
    "pip install --break-system-packages -r requirements.txt",
    "git config user.name $GITLAB_USER_NAME",
    "git config user.email $GITLAB_USER_EMAIL",
    "git fetch origin $PAGES_BRANCH && git -b checkout $PAGES_BRANCH origin/$PAGES_BRANCH || git checkout $PAGES_BRANCH || echo 'Pages branch not deployed yet.'",
    "git checkout $CI_COMMIT_SHA",
    'mike deploy --rebase --prefix public -r $HTTPS_REMOTE -p -b $PAGES_BRANCH -u $(echo "$CI_COMMIT_TAG" | cut -d. -f1,2) latest',
    "mike set-default --rebase --prefix public -r $HTTPS_REMOTE -p -b $PAGES_BRANCH latest",
    "git checkout $PAGES_BRANCH -- public/",
  ]);
  mikePagesJob.addVariables({
    PAGES_BRANCH: "gl-pages",
    HTTPS_REMOTE:
      "https://${GCIX_PUSH_USER}:${GCIX_PUSH_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git",
  });
  mikePagesJob.assignImage("python:3-alpine");

  pipeline.addChildren({
    jobsOrJobCollections: [
      packageJob,
      publishNpmJob,
      publishPyPiJob,
      mikePagesJob,
    ],
  });
}

pipeline.initializeImage("node:18");
pipeline.addTags(["gcix"]);
pipeline.writeYaml();
