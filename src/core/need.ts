/**
 * This module represents the Gitlab CI
 * [needs](https://docs.gitlab.com/ee/ci/yaml/#needs) keyword.
 *
 * Needs are to create relationships between `gcix.Job`s and
 * `gcix.JobCollection`s, which will then be executed as early as all
 * preceding  required jobs finished. This relationship ignores the common
 * ordering by stages.
 *
 * You do not have to use the `Need` class, when simply linking`gcix.Job`s as
 * well as `gcix.JobCollection`s together. When putting jobs and sequences
 * into the `addNeeds()` method, they were translated into `Need`s internally.
 *
 * ```ts
 * const myJob = new Job({stage: "example", scripts: ["do-something.sh"]})
 * const myCollection = new JobCollection()
 * ...
 * const myNextJob = new Job({stage: "example", scripts: ["do-anything.sh"]})
 * myNextJob.addNeeds(myJob, myCollection)
 *
 * const myNextSequence = new JobCollection()
 * myNextSequence.addNeeds(myJob, myCollection)
 * ```
 *
 * In this example `myNextJob` and `myNextCollection` starts as soon as
 *
 * * `myJob` has finished
 * * all jobs within the last stage of `myCollection` have finished
 *
 * That also means that stages are ignored, as the `example` stage for example.
 *
 * However you have to use the `Need` class directly when depending on other
 * pipelines jobs or for further configuration of the need, like not
 * [downloading artifacts](https://docs.gitlab.com/ee/ci/yaml/#artifact-downloads-with-needs)
 * from preceding jobs:
 *
 * ```ts
 * myJob.addNeeds([
 *     new Need({job: "awesome-job", project: "master-pipeline"}),
 *     new Need({job: myJob, artifacts: False}),
 * ])
 * ```
 *
 * You can use `Need` with the `pipeline` parameter, to either download
 * artifacts from a parent pipeline or to mirror the status from an upstream
 * pipeline. Please refer to the official documentation for examples:
 *
 * * [Artifact downloads to child pipelines](https://docs.gitlab.com/ee/ci/yaml/README.html#artifact-downloads-to-child-pipelines)
 * * [Mirror the status from upstream pipelines](https://docs.gitlab.com/ee/ci/yaml/README.html#complex-trigger-syntax-for-multi-project-pipelines)
 */

import { IBase } from "./base";
import { PredefinedVariables } from "./variables";

/**
 * @internal
 */
export interface RenderedNeed {
  readonly job: string;
  readonly artifacts: boolean;
  readonly project: string;
  readonly ref: string;
  readonly pipeline: string;
}

export interface NeedProps {
  /**
   * @description The name of the job to depend on. Could be left if
   * `pipeline` is set.
   * @default undefined but requires `pipeline` to be set.
   */
  readonly job?: string;
  /**
   * @description If the `job` resides in another pipeline you have to give
   * its project name here.
   * @default undefined
   */
  readonly project?: string;
  /**
   * @description Branch of the remote project to depend on.
   * @default undefined
   */
  readonly ref?: string;
  /**
   * @description When `$CI_PIPELINE_ID` of another pipeline is provided,
   * then artifacts from this pipeline are downloaded.
   * When the name of an `other/project` is provided, then the status of an
   * upstream pipeline is mirrored.
   * @default undefined which requires `job` to be set.
   */
  readonly pipeline?: string;
  /**
   * @description Download artifacts from the `job` to depend on.
   * @default true
   */
  readonly artifacts?: boolean;
}

export interface INeed extends IBase {}

/**
 * This class represents the Gitlab CI [needs](https://docs.gitlab.com/ee/ci/yaml/#needs)
 * keyword.
 * The `needs` key-word adds a possibility to allow out-of-order Gitlab CI jobs.
 * A job which needed another job runs directly after the other job as finished
 * successfully.
 *
 * @throws Error If neither `job` nor `pipeline` is set.
 * @throws Error If `ref` is set but `project` is missing.
 * @throws Error If `pipeline` equals the CI_PIPELINE_ID of the own project.
 * @throws Error If both `project` and `pipeline` are set.
 */
export class Need implements INeed {
  job: string | undefined;
  project: string | undefined;
  ref: string | undefined;
  pipeline: string | undefined;
  artifacts: boolean | undefined;

  constructor(props: NeedProps) {
    if (!props.job && !props.pipeline) {
      throw new Error("At least one of `job` or `pipeline` must be set.");
    }
    if (props.ref && !props.project) {
      throw new Error("`ref` parameter requires the `project` parameter.");
    }
    if (props.project && props.pipeline) {
      throw new Error(
        "Needs accepts either `project` or `pipeline` but not both.",
      );
    }

    this.job = props.job;
    this.project = props.project;
    this.ref = props.ref;
    this.pipeline = props.pipeline;
    this.artifacts = props.artifacts ?? true;

    if (this.pipeline && this.pipeline === PredefinedVariables.CI_PIPELINE_ID) {
      throw new Error(`The pipeline attribute does not accept the current
                        pipeline ($CI_PIPELINE_ID). To download artifacts
                        from a job in the current pipeline, use the basic
                        form of needs.`);
    }

    if (this.project && !this.ref) {
      this.ref = "main";
    }
  }

  /**
   * @returns RenderedNeed
   */
  render(): any {
    return {
      job: this.job,
      artifacts: this.artifacts,
      project: this.project,
      ref: this.ref,
      pipeline: this.pipeline,
    };
  }

  isEqual(comparable: IBase): comparable is Need {
    return (
      JSON.stringify(this.render()) === JSON.stringify(comparable.render())
    );
  }
}
