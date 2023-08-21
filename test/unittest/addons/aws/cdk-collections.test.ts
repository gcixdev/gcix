import { Job, JobCollection, Pipeline, Rule, RuleLib } from "../../../../src";
import { DiffDeploy } from "../../../../src/aws";
import { GitlabScripts } from "../../../../src/gitlab";
import { check } from "../../../comparison";

export function myAppDiffDeploy(
  environment: string,
  resource: string,
): JobCollection {
  const collection = new DiffDeploy({
    stacks: [`myapp-${environment}-${resource}`],
  });
  collection.deployJob.toolkitStackName = `application-${environment}-cdk-toolkit`;
  return collection;
}

function environmentPipeline(environment: string): JobCollection {
  const envPipe = new JobCollection();
  envPipe.addChildren({
    jobsOrJobCollections: [myAppDiffDeploy(environment, "project-resources")],
    stage: "project_resources",
  });

  if (environment === "unstable") {
    envPipe.addChildren({
      jobsOrJobCollections: [myAppDiffDeploy(environment, "windows-vm-bucket")],
      stage: "windows_vm_bucket",
    });
    envPipe.addChildren({
      jobsOrJobCollections: [
        new Job({
          stage: "update-windows-vm-image",
          scripts: [`python3 update_windows_vm_image.py ${environment}`],
        }).appendRules([
          RuleLib.onMergeRequestEvents().never(),
          new Rule({ ifStatement: "$IMAGE_SOURCE_PASSWORD" }),
        ]),
      ],
    });
  } else {
    envPipe.addChildren({
      jobsOrJobCollections: [
        new Job({
          stage: "copy-windows-vm-image",
          scripts: [`python3 update_windows_vm_image.py ${environment}`],
        }),
      ],
    });
  }

  if (environment === "dev") {
    envPipe.addChildren({
      jobsOrJobCollections: [
        myAppDiffDeploy(environment, "windows-vm-instances-barista"),
      ],
      stage: "windows_vm_intances",
      name: "barista",
    });
    envPipe.addChildren({
      jobsOrJobCollections: [
        myAppDiffDeploy(environment, "windows-vm-instances-impala"),
      ],
      stage: "windows_vm_intances",
      name: "impala",
    });
  } else {
    envPipe.addChildren({
      jobsOrJobCollections: [
        myAppDiffDeploy(environment, "windows-vm-instances"),
      ],
      stage: "windows_vm_intances",
    });
  }
  return envPipe;
}

test("full pipeline yaml output", () => {
  const pipeline = new Pipeline();
  pipeline.initializeImage("python:3.10-slim");
  pipeline.prependScripts([
    GitlabScripts.cloneRepository("otherproject/configuration"),
    "./install-dependencies.sh",
  ]);
  pipeline.addTags(["environment-iat"]);

  for (const environment of ["unstable", "dev", "tst", "iat"]) {
    const envPipe = environmentPipeline(environment);
    if (environment === "unstable") {
      envPipe.addVariables({ MYPROJECT_RELEASE_VERSION: ">=0.dev" });
    } else {
      envPipe.addVariables({ MYPROJECT_RELEASE_VERSION: "==0.0.dev10" });
    }
    pipeline.addChildren({
      jobsOrJobCollections: [envPipe],
      stage: environment,
    });
  }
  check(pipeline.render(), expect);
});
