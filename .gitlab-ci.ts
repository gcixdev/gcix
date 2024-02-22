import {
  Pipeline,
  JobCollection,
  Job,
  PredefinedVariables,
  Artifacts,
  PagesJob,
} from "./src";
import { BuildGitlabContainerCollection, CranePush, Registry } from "./src/container";

const pipeline = new Pipeline();

const lintJob = new Job({
  scripts: ["npx projen ci:lint"],
  name: "lint",
  stage: "test",
});
const jestJob = new Job({
  scripts: ["npx projen ci:test"],
  artifacts: new Artifacts({
    reports: [{ reportType: "junit", file: "test-reports/junit.xml" }],
  }),
  name: "jest",
  stage: "test",
});
const testCompileJob = new Job({
  scripts: ["npx projen ci:compile"],
  name: "compile",
  stage: "test",
  artifacts: new Artifacts({
    paths: [".jsii", "lib"],
  }),
});
const testPackageJob = new Job({
  scripts: ["npx projen ci:package-all"],
  name: "package",
  stage: "test",
  needs: [testCompileJob],
});
// Changing the node version here to 18.3
// fixes the issue which doesn't package
// @aws-sdk/util-utf8-browser
// see https://github.com/aws/jsii/issues/4178
testPackageJob.assignImage("node:20");
const testCollection = new JobCollection();
testCollection.addChildren({
  jobsOrJobCollections: [lintJob, jestJob, testCompileJob, testPackageJob],
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
  // Changing the node version here to 18.3
  // fixes the issue which doesn't package
  // @aws-sdk/util-utf8-browser
  // see https://github.com/aws/jsii/issues/4178
  packageJob.assignImage("node:20");

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

  pipeline.addChildren({
    jobsOrJobCollections: [
      packageJob,
      publishNpmJob,
      publishPyPiJob,
    ],
  });

  for(const target of ["ts", "py"]){
    let build = new BuildGitlabContainerCollection({})
    build.kanikoExecuteJob.buildTarget = target
    build.kanikoExecuteJob.dockerfile = "docker/Dockerfile"
    build.dockerClientConfig.addAuth(
      Registry.DOCKER,
      "DOCKER_HUB_USERNAME",
      "DOCKER_HUB_TOKEN"
    )
    build.addNeeds([packageJob])

    const pushToDockerHub = new CranePush({
      dstRegistry: Registry.DOCKER,
      imageName: build.cranePushJob.imageName,
      imageTag: build.cranePushJob.imageTag,
      tarPath: build.cranePushJob.tarPath,
      dockerClientConfig: build.cranePushJob.dockerClientConfig,
      jobName: "push-docker-hub"
    })

    build.addChildren({
      jobsOrJobCollections: [
        pushToDockerHub
      ],
    })

    pipeline.addChildren({
      jobsOrJobCollections: [
        build
      ],
      name: `${target}-ctr-img`,
      stage: "publish"
    })
  }

  const mikePagesJob = new PagesJob();
  mikePagesJob.appendScripts([
    "npx projen ci:install:deps",
    "pip install --break-system-packages -r requirements.txt",
    'git config --local user.name "${GITLAB_USER_NAME}"',
    'git config --local user.email "${GITLAB_USER_EMAIL}"',
    "git fetch origin $PAGES_BRANCH && git checkout -b $PAGES_BRANCH origin/$PAGES_BRANCH || git checkout $PAGES_BRANCH || echo 'Pages branch not deployed yet.'",
    "git checkout $CI_COMMIT_SHA",
    "npx projen docs:api",
    'mike deploy --deploy-prefix public --remote $HTTPS_REMOTE --push --branch $PAGES_BRANCH --update-aliases $(echo "$CI_COMMIT_TAG" | cut -d. -f1,2) latest',
    "mike set-default --deploy-prefix public --remote $HTTPS_REMOTE --push --branch $PAGES_BRANCH latest",
    "git checkout $PAGES_BRANCH -- public/",
  ]);
  mikePagesJob.addVariables({
    PAGES_BRANCH: "gl-pages",
    HTTPS_REMOTE:
      "https://${GCIX_PUSH_USER}:${GCIX_PUSH_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git",
  });
  mikePagesJob.assignImage("node:20");

  pipeline.addChildren({
    jobsOrJobCollections: [
      mikePagesJob,
    ],
  });
}

pipeline.initializeImage("node:20");
pipeline.addTags(["gcix"]);
pipeline.writeYaml();
