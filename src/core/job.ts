/**
 * This module represents the Gitlab CI [Job](https://docs.gitlab.com/ee/ci/yaml/README.html#job-keywords)
 *
 * It contains the general `Job` class as well as a special `TriggerJob` class. The latter one is a subclass
 * of `Job` but has on the one hand reduced capabilities, on the other hand it has the additional functionality
 * to trigger other pipelines.
 *
 * Here is a simple example how you define and use a `Job`:
 *
 * ```python
 * from gcip import Pipeline, Job
 *
 * pipeline = Pipeline()
 * job = Job(stage="build", script="build my artefact")
 * pipeline.add_children(job, name="artifact")
 * pipeline.write_yaml()
 *
 * # stages:
 * #   - build
 * # build-artifact:
 * #   stage: build
 * #   script: build my artifact
 * ```
 *
 * A `Job` has always a `script` and at least one of `stage` or `name`.
 * The `stage` will be used for the name of the stage of the job and the
 * job name itself, whereas `name` is only used for the job`s name. When adding
 * a job to a `gcip.core.pipeline.Pipeline` or a `gcip.core.sequence.Sequence`
 * you can and should define a `name` or `stage` too. This is how you
 * distinguish between two jobs of the same kind added to a pipeline:
 *
 * ```python
 * def create_build_job(artifact: str, job_name: str = "artifact", job_stage: str = "build") -> Job:
 *     return Job(name=job_name, stage=job_stage, script=f"build my {artifact}")
 *
 * pipeline.add_children(create_build_job("foo"), name="bar")
 * pipeline.add_children(create_build_job("john"), name="deere")
 *
 * # stages:
 * #   - build
 * # build-artifact-bar:
 * #   stage: build
 * #   script: build my foo
 * # build-artifact-deere:
 * #     stage: build
 * #     script: build my john
 * ```
 *
 * Again `name` or `stage` decide whether to add the string to the
 * stage of a job or not:
 *
 * ```python
 * def create_build_job(job_name: str = "artifact", job_stage: str = "build", artifact: str) -> Job:
 *     return Job(name=job_name, stage=job_stage, script=f"build my {artifact}")
 *
 * pipeline.add_children(create_build_job("foo"), stage="bar")
 * pipeline.add_children(create_build_job("john"), stage="deere")
 *
 * # stages:
 * #   - build_bar
 * #   - build_deere
 * # build-bar-artifact:
 * #   stage: build_bar
 * #   script: build my foo
 * # build-deere-artifact:
 * #     stage: build_deere
 * #     script: build my john
 * ```
 *
 * This also decides whether to run the jobs in parralel or sequential. When using
 * `stage` and adding the string also to the jobs stage the stages for both jobs
 * differ. When using `name` only the name of the jobs differ but the name of the stage
 * remains the same.
 *
 * An `Job` object has a lot of methods for further configuration of typical Gitlab CI
 * [Job keywords]/https://docs.gitlab.com/ee/ci/yaml/README.html#job-keywords), like
 * configuring tags, rules, variables and so on. Methods with names staring with..
 *
 * * **`set_*`** will initally set or overwrite any previous setting, like `set_image()`
 * * **`add_*`** will append a value to previous ones, like `add_tags()`
 * * **`append_*`** will do the same as `add_*`, but for values where order matters. So it
 *    explicitly adds a value to the end of a list of previous values, like `append_rules()`
 * * **`prepend_*`** is the counterpart to `append_*` and will add a value to the beginning
 *   of a list of previous values, like `prepend_rules()`
 */

import { Cache, IBase, Image, Need, Rule, Variables, Artifacts, OrderedStringSet, IncludeLocal, IncludeFile, IncludeRemote, IncludeTemplate, IncludeArtifact } from '.';
import { JobCollection } from './job-collection';
import { deepcopy } from '../helper';

export interface RenderedJob {}

export interface JobProps {
  /**
   * @description The [script(s)](https://docs.gitlab.com/ee/ci/yaml/README.html#script) to be executed.
   */
  readonly scripts: string[];
  /**
   * @description The name of the job. In opposite to `stage` only the name
   * is set and not the stage of the job. If `name` is set, than the jobs
   * stage has no value, which defaults to the 'test' stage.
   *
   * Either `name` or `stage` must be set. Defaults to `None`.
   */
  readonly name?: string;
  /**
   * @description The name and stage of the job. In opposite to `name` also
   * the jobs stage will be setup with this value.
   *
   * Either `name` or `stage` must be set.
   */
  readonly stage?: string;
  /**
   * @description
   * @TODO add description
   */
  readonly image?: string | Image;
  /**
   * @description The [allow_failure](https://docs.gitlab.com/ee/ci/yaml/#allow_failure) keyword of the Job.
   */
  readonly allowFailure?: boolean | string | number | number[];
  /**
   * @description
   * @TODO add description
   */
  readonly variables?: Variables;
  /**
   * @description
   * @TODO add description
   */
  readonly tags?: string[];
  /**
   * @description
   * @TODO add description
   */
  readonly rules?: Rule[];
  /**
   * @description
   * @TODO add description
   */
  readonly dependencies?: (Job | JobCollection)[];
  /**
   * @description
   * @TODO add description
   */
  readonly needs?: (Job | JobCollection | Need)[];
  /**
   * @description
   * @TODO add description
   */
  readonly artifacts?: Artifacts;
  /**
   * @description
   * @TODO add description
   */
  readonly cache?: Cache;
}

export interface IJobBase extends IBase {
  /**
   * Getter method to receive added tags.
   */
  tags: string[];
  /**
   * @description Adds one or more [variables](https://docs.gitlab.com/ee/ci/yaml/README.html#variables), to the job.
   */
  addVariables(variables: Variables): Job;
  /**
   * @description Sets the [cache](https://docs.gitlab.com/ee/ci/yaml/README.html#cache) keyword of the Job.
   *
   * !! Any previous values will be overwritten.
   */
  assignCache(cache: Cache): Job;
  /**
   * @description Sets the [artifacts](https://docs.gitlab.com/ee/ci/yaml/README.html#artifacts) keyword of the Job.
   * !! Any previous values will be overwritten.
   */
  assignArtifacts(artifacts: Artifacts): Job;
  /**
   * @description Adds one or more [tags](https://docs.gitlab.com/ee/ci/yaml/README.html#tags) to the job.
   */
  addTags(tags: string[]): Job;
  /**
   * @description Appends one or more  [rule](https://docs.gitlab.com/ee/ci/yaml/README.html#rules)s rules to the job.
   */
  appendRules(rules: Rule[]): Job;
  /**
   * @description Inserts one or more  [rule](https://docs.gitlab.com/ee/ci/yaml/README.html#rules)s before the current rules of the job.
   */
  prependRules(rules: Rule[]): Job;
  /**
   * @description Add one or more [dependencies](https://docs.gitlab.com/ee/ci/yaml/README.html#dependencies) to the job.
   */
  addDependencies(dependencies: (Need | Job | JobCollection)[]): Job;
  /**
   * @description Add one or more [needs](https://docs.gitlab.com/ee/ci/yaml/README.html#needs) to the job.
   */
  addNeeds(needs: (Need | Job | JobCollection)[]): Job;
  /**
   * @description Inserts one or more [script](https://docs.gitlab.com/ee/ci/yaml/README.html#script)s before the current scripts.
   */
  prependScripts(scripts: string[]): Job;
  /**
   * @description Adds one or more [script](https://docs.gitlab.com/ee/ci/yaml/README.html#script)s after the current scripts.
   */
  appendScripts(scripts: string[]): Job;
  /**
   * Return all instance names from the given child.
   *
   * That means all combinations of the childs name and stage within this
   * sequence and all parent sequences.
   */
  getAllInstanceNames(child?: Job | JobCollection): OrderedStringSet;
}

export interface IJob extends IJobBase {
  original?: Job;
  /**
   * Sets the image of this job.
   *
   * For a simple container image you can provide the origin of the image.
   * If you want to set the entrypoint, you have to provide an Image object instead.
   *
   * !! Any previous values will be overwritten.
   *
   * @param image
   * @returns Job the modified `Job` object.
   */
  assignImage(image: string | Image): Job;
  /**
   * @description Set the [tags](https://docs.gitlab.com/ee/ci/yaml/README.html#tags) to the job.
   *
   * !! Any previous values will be overwritten.
   */
  assignTags(tags: string[]): Job;
  /**
   * @description Set the list of [dependencies](https://docs.gitlab.com/ee/ci/yaml/index.html#dependencies) of this job.
   *
   * !! Any previous values will be overwritten.
   */
  assignDependencies(dependencies: (Need | Job | JobCollection)[]): Job;
  /**
   * @description Set the list of [needs](https://docs.gitlab.com/ee/ci/yaml/README.html#needs) of this job.
   */
  assignNeeds(needs: (Need | Job | JobCollection)[]): Job;
  /**
   * @description Sets `allow_failure` for this job.
   */
  assignAllowFailure(allowFailure: boolean | string | number | number[]): Job;
  /**
   * This method is used by `gcip.core.sequence.Sequence`s to populate the jobs name.
   * @param name to append to the current name.
   */
  extendName(name: string): void;
  /**
     * This method is used by `gcip.core.sequence.Sequence`s to populate the jobs stage.
     * @param stage name to extend the stage.
     */
  extendStageValue(stage: string): void;
  /**
     * This method is used by `gcip.core.sequence.Sequence`s to populate the jobs name and stage.
     * @param stage name to extend the stage and the name
     */
  extendStage(stage: string): void;
  /**
   * This method is called by `gcip.core.sequence.Sequence`s when the job is added to that sequence.
   *
   * The job needs to know its parents when `_get_all_instance_names()` is called.
   * @param parent any type of Job or JobCollection
   */
  addParent(parent: Job | JobCollection ): void;
  /**
   * Returns an independent, deep copy object of this job.
   */
  copy(): Job;
}

/**
 * This class represents the Gitlab CI [Job](https://docs.gitlab.com/ee/ci/yaml/README.html#job-keywords)
 */
export class Job implements IJob {
  name: string;
  stage: string;
  original?: Job;
  scripts: string[];
  allowFailure: string | number | boolean | number[];
  image?: Image;
  orderedTags: OrderedStringSet;
  rules?: Rule[];
  cache?: Cache;
  variables?: Variables;
  artifacts?: Artifacts;
  dependencies?: (Need | Job | JobCollection)[];
  needs?: (Need | Job | JobCollection)[];
  parents: (Job | JobCollection)[];
  constructor(props: JobProps) {
    if (props.stage && props.name) {
      this.name = `${props.name}-${props.stage}`;
      this.stage = props.stage;
    } else if (props.stage) {
      this.name = props.stage;
      this.stage = props.stage;
    } else if (props.name) {
      this.name = props.name;
      // default for unset stages is 'test' -> https://docs.gitlab.com/ee/ci/yaml/#stages
      this.stage = 'test';
    } else {
      throw new Error('At least one of the parameters `name` or `stage` have to be set.');
    }
    this.name = this.name.replace(/_/gm, '-');
    this.stage = this.stage.replace(/-/gm, '_');
    this.scripts = props.scripts;
    this.cache = props.cache;
    /**
    * internally self._allow_failure is set to a special value 'untouched' indicating this value is untouched by the user.
    * This is because the user can set the value from outside to True, False or None, indicating the value should not be rendered.
    * 'untouched' allows for sequences to determine, if this value should be initialized or not.
    */
    this.allowFailure = props.allowFailure ?? 'untouched';
    this.orderedTags = new OrderedStringSet();

    props.tags && this.addTags(props.tags);
    props.artifacts && this.assignArtifacts(props.artifacts);
    props.image ? this.assignImage(props.image) : this.image = undefined;
    props.rules ? this.appendRules(props.rules) : this.rules = undefined;
    props.dependencies ? this.addDependencies(props.dependencies) : this.dependencies = undefined;
    props.needs ? this.addNeeds(props.needs) : this.needs = undefined;
    props.variables ? this.addVariables(props.variables) : this.variables = undefined;

    this.parents = [];


    /**
     * Only set if you get a `copy` of this job
     */
    this.original = undefined;
  }
  get tags() {
    return this.orderedTags.values;
  }

  copy(): Job {
    const jobCopy = deepcopy(this);
    jobCopy.original = this;
    return jobCopy;
  }

  // @ts-ignore
  getAllInstanceNames(child?: Job | JobCollection): OrderedStringSet {
    const instanceName: OrderedStringSet = new OrderedStringSet();
    for (const parent of this.parents) {
      for (const prefix of parent.getAllInstanceNames(this)) {
        if (prefix) {
          instanceName.add(`${prefix}-${this.name}`);
        } else {
          instanceName.add(this.name);
        }
      }
    }
    return instanceName;
  }
  appendScripts(scripts: string[]): Job {
    this.scripts = [...this.scripts, ...scripts];
    return this;
  }
  prependScripts(scripts: string[]): Job {
    this.scripts = [...scripts, ...this.scripts];
    return this;
  }
  addVariables(variables: Variables): Job {
    this.variables = { ...this.variables, ...variables };
    return this;
  }
  assignCache(cache: Cache): Job {
    this.cache = cache;
    return this;
  }
  assignArtifacts(artifacts: Artifacts): Job {
    this.artifacts = artifacts;
    return this;
  }
  appendRules(rules: Rule[]): Job {
    if (this.rules instanceof Array) {
      this.rules = [...this.rules, ...rules];
    } else {
      this.rules = rules;
    }
    return this;
  }
  prependRules(rules: Rule[]): Job {
    if (this.rules instanceof Array) {
      this.rules = [...rules, ...this.rules];
    } else {
      this.rules = rules;
    }
    return this;
  }
  addDependencies(dependencies: (Need | Job | JobCollection)[]): Job {
    if (this.dependencies instanceof Array) {
      this.dependencies = [...this.dependencies, ...dependencies];
    } else {
      this.dependencies = dependencies;
    }
    return this;
  }
  assignDependencies(dependencies: (Need | Job | JobCollection)[]): Job {
    this.dependencies = dependencies;
    return this;
  }
  addNeeds(needs: (Need | Job | JobCollection)[]): Job {
    if (this.needs instanceof Array && this.needs.length > 0) {
      this.needs = [...this.needs, ...needs];
    } else {
      this.needs = needs;
    }
    return this;

  }
  assignNeeds(needs: (Need | Job | JobCollection)[]): Job {
    this.needs = needs;
    return this;
  }
  assignAllowFailure(allowFailure: string | number | boolean | number[]): Job {
    this.allowFailure = allowFailure;
    return this;
  }
  assignImage(image: string | Image): Job {
    if (typeof image === 'string') {
      this.image = new Image({
        name: image,
      });
    } else if (image instanceof Image) {
      this.image = image;
    }
    return this;
  }
  addTags(tags: string[]): Job {
    for (const tag of tags) {
      this.orderedTags.add(tag);
    }
    return this;
  }
  assignTags(tags: string[]) {
    this.orderedTags = new OrderedStringSet(tags);
    return this;
  }
  extendName(name: string) {
    this.name = `${name.replace(/_/gm, '-')}-${this.name}`;
  }
  extendStageValue(stage: string) {
    this.stage = `${this.stage}_${stage.replace(/-/g, '_')}`;
  }
  extendStage(stage: string) {
    this.extendName(stage);
    this.extendStageValue(stage);
  }
  addParent(parent: Job | JobCollection ) {
    this.parents.push(parent);
  }
  isEqual(comparable: IBase): comparable is Job {
    return this.render() === comparable.render();

  }
  render(): any {
    const renderedJob: any = {};

    if (this.image) {
      renderedJob.image = this.image.render();
    }

    // self._allow_failure should not be rendered when its value is None or
    // the internal special value 'untouched'
    if (this.allowFailure instanceof Boolean) {
      renderedJob.allow_failure = this.allowFailure;
    } else if (Array.isArray(this.allowFailure)) {
      renderedJob.allow_failure.exit_codes = this.allowFailure;
    }

    if (this.dependencies) {
      const dependency_jobs: Array<Job> = [];
      for (const dependency of this.dependencies) {
        if (dependency instanceof Job) {
          dependency_jobs.push(dependency);
        } else if (dependency instanceof JobCollection) {
          for (const job of dependency.nestedJobs) {
            dependency_jobs.push(job);
          }
        } else {
          throw new Error(`Dependency '${dependency}' is of type ${typeof dependency}.`);
        }
      }

      const dependency_names: OrderedStringSet = new OrderedStringSet();
      for (const job of dependency_jobs) {
        for (const name of job.getAllInstanceNames().values) {
          dependency_names.add(name);
        }
      }
      renderedJob.dependencies = dependency_names.values.sort();
    }

    if (this.needs) {
      const needJobs: Job[] = [];
      const renderedNeeds: Need[] = [];
      for (const need of this.needs) {
        if (need instanceof Job) {
          needJobs.push(need);
        } else if (need instanceof JobCollection) {
          for (const job of need.lastJobsExecuted) {
            needJobs.push(job);
          }
        } else if (need instanceof Need) {
          renderedNeeds.push(need.render() as Need);
        } else {
          throw new Error(`Need '${need}' is of type '${typeof need}'`);
        }
      }

      const jobNames: OrderedStringSet = new OrderedStringSet();
      for (const job of needJobs) {
        jobNames.add(job.getAllInstanceNames().values);
      }

      for (const name of jobNames) {
        renderedNeeds.push(new Need({ job: name }).render() as Need);
      }

      // sort needs by the name of the referenced job or pipeline
      renderedNeeds.sort((a, b) => {
        const keyA = a.job ? a.job : a.pipeline!;
        const keyB = b.job ? b.job : b.pipeline!;

        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
      renderedJob.needs = renderedNeeds;
    }
    renderedJob.stage = this.stage;
    renderedJob.script = this.scripts;
    renderedJob.variables = this.variables;

    if (this.rules) {
      const renderedRules: Rule[] = [];
      for (const rule of this.rules) {
        renderedRules.push(rule.render() as Rule);
      }
      renderedJob.rules = renderedRules;
    }

    if (this.cache) {
      renderedJob.cache = this.cache.render();
    }

    if (this.artifacts) {
      const renderedArtifacts = this.artifacts.render();
      if (renderedArtifacts) {
        renderedJob.artifacts = renderedArtifacts;
      }
    }

    if (this.orderedTags.size > 0) {
      renderedJob.tags = this.orderedTags.values;
    }

    return renderedJob;
  }
}

/**
 * @internal
 */
export interface RenderedTriggerJob {

}

/**
 * This class represents the [trigger:strategy](https://docs.gitlab.com/ee/ci/yaml/README.html#linking-pipelines-with-triggerstrategy)
    keyword.
 */
export enum TriggerStrategy {
  /**
   * Use this strategy to force the `TriggerJob` to wait for the downstream (multi-project or child) pipeline to complete.
   */
  DEPEND = 'depend'
}

export interface TriggerJobProps {
  /**
   * @description The name of the trigger job.
   */
  readonly name?: string;
  /**
   * @description The stage of the trigger job.
   */
  readonly stage?: string;
  /**
   * @description The full name of another Gitlab project to trigger
   * (multi-project pipeline trigger). Mutually exclusive with `includes`.
   */
  readonly project?: string;
  /**
   * @description The branch of `project` the pipeline should be triggered of.
   */
  readonly branch?: string;
  /**
   * @description Include a pipeline to trigger (Parent-child pipeline trigger)
   * Mutually exclusiv with `project`.
   */
  readonly includes?: Array<IncludeLocal | IncludeFile | IncludeRemote | IncludeTemplate | IncludeArtifact>;
  /**
   * @description Determines if the result of this pipeline depends on the
   * triggered downstream pipeline (use `TriggerStrategy.DEPEND`) or if just
   * "fire and forget" the downstream pipeline (use `None`).
   */
  readonly strategy?: TriggerStrategy;
}


export interface IPagesJob {
  /**
   * Set the name of this jobs stage to a value other than `pages`.
   * @param stage A valid Gitlab CI Job stage name.
   */
  assignStage(stage: string): PagesJob;
  /**
   * The jobs name `pages` is fixed and can't be altered.
   */
  extendName(name: string): void;
  /**
   * The stage name can't be altered from parent sequences.
   */
  extendStage(name: string): void;
  /**
   * Extending the name of the stage is not allowed on this Job
   */
  extendStageValue(name: string): void;
  /**
   * There should be only one instance of this job, that is why this method
   * does not return a copy of this job but the job itself.
   */
  copy(): Job;
}

/**
 *
 * This is a special kind of jobs which deploys Gitlab Pages.
 *
 * This job has the static name `pages` and the static artifacts path
 * `./public`. Both preconfigurations can't be altered and are required for
 * deploying Gitlab Pages properly. All methods which would typically alter the
 *  name, stage and artifacts of a job are overwritten with an empty implementation.
 *
 * This job is only for deploying Gitlab Pages artifacts within the `./public`
 * artifacts path. To create the artifacts you have to run jobs, that generate
 * those artifacts within the same `./public` artifacts path, before this
 * PagesJob in the pipeline.
 *
 * Because the name of the job can't be altered, this job may only exist once
 * in the generated pipeline output.
 * Typically you should add the PagesJob to the `gcip.core.pipeline.Pipeline`.
 *
 * The PagesJob is also preconfigured with the stage `pages` and the image
 * `alpine:latest`. To change the stage of this job, use the `set_stage()`
 * method. Please mention to run this job in a stage after all jobs, that fill
 * the `public` artifacts path with content.
 *
 * Here a simple example how to use the GitlabPages job:
 *
 * ```
 * pipeline = Pipeline()
 * pipeline.add_children(
 *     Job(stage="deploy", script="./create-html.sh").add_artifacts_paths("public"),
 *     PagesJob(),
 * )
 * ```
 */
export class PagesJob extends Job implements IPagesJob {
  constructor() {
    super({
      stage: 'pages',
      name: 'pages',
      scripts: ['echo "Publishing Gitlab Pages"'],
      artifacts: new Artifacts({ paths: ['public'] }),
    });
    super.assignImage('busybox:latest');
  }
  assignStage(stage: string): PagesJob {
    this.stage = stage;
    return this;
  }
  extendName(name: string): void {
    console.log('Method `extendName` not callable on `PagesJob`: ' + name);
    throw new Error('Method `extendName` not callable on `PagesJob`');
  }
  extendStage(name: string): void {
    console.log('Method `extendStage` not callable on `PagesJob`: ' + name);
    throw new Error('Method `extendStage` not callable on `PagesJob`');
  }
  extendStageValue(name: string): void {
    console.log('Method `extendStageValue` not callable on `PagesJob`: ' + name);
    throw new Error('Method `extendStageValue` not callable on `PagesJob`');
  }

  // @ts-ignore
  getAllInstanceNames(child?: Job | JobCollection): OrderedStringSet {
    return new OrderedStringSet([this.name]);
  }
  copy(): Job {
    return this;
  }
}
