/**
 * This module represents the Gitlab CI [needs](https://docs.gitlab.com/ee/ci/yaml/#needs) keyword.
 *
 * Needs are to create relationships between `gcip.core.job.Job`s and `gcip.core.sequence.Sequence`s, which will
 * then be executed as early as all preceding required jobs finished. This relationship ignores the common ordering by stages.
 *
 * You do not have to use the `Need` class, when simply linking`gcip.core.job.Job`s as well as `gcip.core.sequence.Sequence`s
 * together. When putting jobs and sequences into the `add_needs()` methods, they were translated into `Need`s internally:
 *
 * ```
 * my_job = Job(stage="example", script="do-something.sh")
 * my_sequence = Sequence()
 * ...
 * my_next_job = Job(stage="example", script="do-anything.sh")
 * my_next_job.add_needs(my_job, my_sequence)
 *
 * my_next_sequence = Sequence()
 * my_next_sequence.add_needs(my_job, my_sequence)
 * ```
 *
 * In this example `my_next_job` and `my_next_sequence` start as soon as
 *
 * * `my_job` has finished
 * * all jobs within the last stage of `my_sequence` have finished
 *
 * That also mean that stages are ignored, as the `example` stage for example.
 *
 * However you have to use the `Need` class directly when depending on other pipelines jobs or for further configuration of the need,
 * like not [downloading artifacts](https://docs.gitlab.com/ee/ci/yaml/#artifact-downloads-with-needs) from preceding jobs:
 *
 * ```
 * my_job.add_needs(
 *     Need("awesome-job", project="master-pipeline"),
 *     Need(my_job, artifacts=False),
 *     )
 * ```
 *
 * You can use `Need` with the `pipeline` parameter, to either download artifacts from a parent pipeline or to
 * mirror the status from an upstream pipeline. Please refer to the official documentation for examples:
 *
 * * [Artifact downloads to child pipelines](https://docs.gitlab.com/ee/ci/yaml/README.html#artifact-downloads-to-child-pipelines)
 * * [Mirror the status from upstream pipelines](https://docs.gitlab.com/ee/ci/yaml/README.html#complex-trigger-syntax-for-multi-project-pipelines)
 */

import { IBase } from './base';
import { PredefinedVariables } from './variables';

//         rendered_need: Dict[str, Union[str, bool]] = {}
export interface RenderedNeed {
  needs: {
    job: string;
    artifacts: boolean;
    project: string;
    ref: string;
    pipeline: string;
  };
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
  readonly project: string;
  /**
   * @description Branch of the remote project to depend on.
   * @default undefined
   */
  readonly ref: string;
  /**
   * @description When `$CI_PIPELINE_ID` of another pipeline is provided,
   * then artifacts from this pipeline are downloaded.
   * When the name of an `other/project` is provided, then the status of an
   * upstream pipeline is mirrored.
   * @default undefined which requires `job` to be set.
   */
  readonly pipeline: string;
  /**
   * @description Download artifacts from the `job` to depend on.
   * @default true
   */
  readonly artifacts: boolean;
}

export interface INeed extends IBase{

}

/**
 * This class represents the Gitlab CI [needs](https://docs.gitlab.com/ee/ci/yaml/#needs) keyword.
 * The `needs` key-word adds a possibility to allow out-of-order Gitlab CI jobs.
 * A job which needed another job runs directly after the other job as finished successfully.
 *
 * @throws Error If neither `job` nor `pipeline` is set.
 * @throws Error If `ref` is set but `project` is missing.
 * @throws Error If `pipeline` equals the CI_PIPELINE_ID of the own project.
 * @throws Error If both `project` and `pipeline` are set.
 */
export class Need implements INeed {
  job: string | undefined;
  project: string;
  ref: string;
  pipeline: string;
  artifacts: boolean;

  constructor(props: NeedProps) {
    if (!props.job && !props.pipeline) {
      throw new Error('At least one of `job` or `pipeline` must be set.');
    }
    if (props.ref && !props.project) {
      throw new Error('`ref` parameter requires the `project` parameter.');
    }
    if (props.project && props.pipeline) {
      throw new Error('Needs accepts either `project` or `pipeline` but not both.');
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
      this.ref = 'main';
    }
  }

  /**
   * @returns RenderedNeed
   */
  render(): any {
    return {
      needs: {
        job: this.job,
        artifacts: this.artifacts,
        project: this.project,
        ref: this.ref,
        pipeline: this.pipeline,
      },
    };
  }

  /**
   * Compares the rendered output of this object and the given need object.
   * @param need
   * @returns true if the given `Need` object is equal to this object.
   */
  isEqual(need: Need): boolean {
    return this.render() === need.render();
  }
}
