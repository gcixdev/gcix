/**
 * A Sequence collects multiple `gcip.core.job.Job`s and/or other `gcip.core.sequence.Sequence`s into a group.
 *
 * This concept is no official representation of a Gitlab CI keyword. But it is such a powerful
 * extension of the Gitlab CI core funtionality and an essential building block of the gcip, that
 * it is conained in the `gcip.core` module.
 *
 * A Sequence offers a mostly similar interface like `gcip.core.job.Job`s that allows to modify
 * all Jobs and child Sequences contained into that parent Sequence. For example: Instad of calling
 * `add_tag()` on a dozens of Jobs you can call `add_tag()` on the sequence that contain those Jobs.
 * The tag will then be applied to all Jobs in that Sequence and recursively to all Jobs within child
 * Sequenes of that Sequence.
 *
 * Sequences must be added to a `gcip.core.pipeline.Pipeline`, either directly or as part of other Sequences.
 * That means Sequences are not meant to be a throw away configuration container for a bunch ob Jobs.
 * This is because adding a Job to a Sequence creates a copy of that Job, which will be inderectly added to
 * the `Pipeline` by that Sequence. Not adding that Sequence to a Pipeline means also not adding its Jobs
 * to the Pipeline. If other parts of the Pipeline have dependencies to those Jobs, they will be broken.
 *
 * As said before, adding a Job to a Sequence creates copies of that Job. To void conflicts between Jobs,
 * you should set `name` and/or `stage` when adding the job (or child sequence). The sequence will add
 * the `name`/`stage` to the ones of the Job, when rendering the pipeline. If you do not set those
 * identifiers, or you set equal name/stages for jobs and sequences, you provoke having two or more
 * jobs having the same name in the pipeline. The gcip will raise a ValueError, to avoid unexpected
 * pipeline behavior. You can read more information in the chapter "Stages allow reuse of jobs
 * and sequences" of the user documantation.
 */

import { IBase, OrderedStringSet, Variables, Artifacts, Cache, Image, Job, Need, Rule } from '.';
import { deepcopy } from '../helper';

export interface ChildDict {
  readonly child: Job | JobCollection;
  readonly stage?: string;
  readonly name?: string;
}

export interface AddChildrenProps {
  readonly jobsOrJobCollections: (Job | JobCollection)[];
  readonly stage?: string;
  readonly name?: string;
}

export interface IJobCollectionBase extends IBase {
  /**
   * @description Adds one or more [variables](https://docs.gitlab.com/ee/ci/yaml/README.html#variables), to the job.
   */
  addVariables(variables: Variables): JobCollection;
  /**
   * @description Sets the [cache](https://docs.gitlab.com/ee/ci/yaml/README.html#cache) keyword of the Job.
   *
   * !! Any previous values will be overwritten.
   */
  assignCache(cache: Cache): JobCollection;
  /**
   * @description Sets the [artifacts](https://docs.gitlab.com/ee/ci/yaml/README.html#artifacts) keyword of the Job.
   * !! Any previous values will be overwritten.
   */
  assignArtifacts(artifacts: Artifacts): JobCollection;
  /**
   * @description Adds one or more [tags](https://docs.gitlab.com/ee/ci/yaml/README.html#tags) to the job.
   */
  addTags(tags: string[]): JobCollection;
  /**
   * @description Appends one or more  [rule](https://docs.gitlab.com/ee/ci/yaml/README.html#rules)s rules to the job.
   */
  appendRules(rules: Rule[]): JobCollection;
  /**
   * @description Inserts one or more  [rule](https://docs.gitlab.com/ee/ci/yaml/README.html#rules)s before the current rules of the job.
   */
  prependRules(rules: Rule[]): JobCollection;
  /**
   * @description Add one or more [dependencies](https://docs.gitlab.com/ee/ci/yaml/README.html#dependencies) to the job.
   */
  addDependencies(dependencies: (Need | Job | JobCollection)[]): JobCollection;
  /**
   * @description Add one or more [needs](https://docs.gitlab.com/ee/ci/yaml/README.html#needs) to the job.
   */
  addNeeds(needs: (Need | Job | JobCollection)[]): JobCollection;
  /**
   * @description Inserts one or more [script](https://docs.gitlab.com/ee/ci/yaml/README.html#script)s before the current scripts.
   */
  prependScripts(scripts: string[]): JobCollection;
  /**
   * @description Adds one or more [script](https://docs.gitlab.com/ee/ci/yaml/README.html#script)s after the current scripts.
   */
  appendScripts(scripts: string[]): JobCollection;
  /**
   * Return all instance names from the given child.
   *
   * That means all combinations of the childs name and stage within this
   * sequence and all parent sequences.
   */
  getAllInstanceNames(child?: Job | JobCollection): OrderedStringSet;
}

export interface IJobCollection extends IJobCollectionBase {
  parents: (Job | JobCollection)[];
  children: ChildDict[];
  allowFailureForInitialization?: string | boolean | number[];
  allowFailureForReplacement?: string | boolean | number[];
  variables?: Variables;
  variablesForInitialization?: Variables;
  variablesForReplacement?: Variables;
  cache?: Cache;
  cacheForInitialization?: Cache;
  artifacts?: Artifacts;
  artifactsForInitialization?: Artifacts;
  artifactsForReplacement?: Artifacts;
  orderedTags: OrderedStringSet;
  orderedTagsForInitialization: OrderedStringSet;
  orderedTagsForReplacement: OrderedStringSet;
  rulesToAppend?: Rule[];
  rulesToPrepend?: Rule[];
  rulesForInitialization?: Rule[];
  rulesForReplacement?: Rule[];
  dependencies?: (Job | JobCollection | Need)[];
  dependenciesForInitialization?: (Job | JobCollection | Need)[];
  dependenciesForReplacement?: (Job | JobCollection | Need)[];
  needs?: (Need | Job | JobCollection)[];
  needsForInitialization?: (Need | Job | JobCollection)[];
  needsForReplacement?: (Need | Job | JobCollection)[];
  scriptsToPrepend?: string[];
  scriptsToAppend?: string[];
  imageForInitialization?: Image | string;
  imageForReplacement?: Image | string;
  /**
   * Returns a list with populated copies of all nested jobs of this sequence.
   *
   * Populated means, that all attributes of a Job which depends on its context
   * are resolved to their final values. The context is primarily the sequence
   * within the jobs resides but also dependencies to other jobs and sequences.
   * Thus this sequence will apply its own configuration, like variables to add,
   * tags to set, etc., to all its jobs and sequences.
   *
   * Copies means what it says, that the returned job are not the same job
   * objects, originally added to this sequence, but copies of them.
   *
   * Nested means, that also jobs from sequences within this sequence,
   * are returned, as well as jobs from sequences within sequences within
   * this sequence and so on.
   */
  readonly populatedJobs: Job[];
  /**
   * This property returns all Jobs from the last stage of this sequence.
   *
   * This is typically be requested from a job which has setup this sequence
   * as need, to determine all actual jobs of this sequence as need.
   */
  readonly lastJobsExecuted: Job[];
  /**
   * @returns all jobs of this this sequences as well as jobs of
   * sub-sequences recursively.
   */
  readonly nestedJobs: Job[];
  /**
  * Add `gcip.core.job.Job`s or other `gcip.core.sequence.Sequence`s to this sequence.
  *
  * Adding a child creates a copy of that child. You should provide a name or stage
  * when adding children, to make them different from other places where they will be used.
  *
  * @returns JobCollection of the modified `JobCollection` object.
  */
  addChildren(props: AddChildrenProps): JobCollection;
  /**
   * Calling `gcip.core.job.Job.add_variables()` to all jobs within this
   * sequence that haven't been added variables before.
   * @param variables ???
   */
  initializeVariables(variables: Variables): JobCollection;
  /**
   * Calling `gcip.core.job.Job.add_variables()` to all jobs within this
   * sequence and overriding any previously added variables to that jobs.
   * @param variables ???
   */
  overrideVariables(variables: Variables): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_cache()` to all jobs within this sequence
   * that haven't been set the cache before.
   * @param cache ???
   */
  initializeCache(cache: Cache): JobCollection;
  /**
   * Sets `gcip.core.job.Job.artifacts` to all jobs within this sequence that
   * haven't been set the artifacs before.
   * @param artifacts ???
   */
  initializeArtifacts(artifacts: Artifacts): JobCollection;
  /**
   * Calling `gcip.core.job.Job.add_tags()` to all jobs within this sequence
   * that haven't been added tags before.
   * @param tags ???
   */
  initializeTags(tags: string[]): JobCollection;
  /**
   * Calling `gcip.core.job.Job.add_tags()` to all jobs within this sequence
   * and overriding any previously added tags to that jobs.
   * @param tags ???
   */
  overrideTags(tags: string[]): JobCollection;
  /**
   * Calling `gcip.core.job.Job.append_rules()` to all jobs within this
   * sequence that haven't been added rules before.
   * @param rules ???
   */
  initializeRules(rules: Rule[]): JobCollection;
  /**
   * Calling `gcip.core.job.Job.override_rules()` to all jobs within this
   * sequence and overriding any previously added rules to that jobs.
   * @param rules ???
   */
  overrideRules(rules: Rule[]): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_dependencies()` to all jobs within the
   * first stage of this sequence that haven't been added dependencies before.
   *
   * An empty parameter list means that jobs will get an empty dependency
   * list and thus does not download artifacts by default.
   * @param dependencies ???
   */
  initializeDependencies(dependencies: (Job | JobCollection | Need)[]): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_dependencies()` to all jobs within the
   * first stage of this sequence and overriding any previously added
   * dependencies to that jobs.
   *
   * An empty parameter list means that jobs will get an empty dependency list and thus does not download artifacts.
   * @param dependencies ???
   */
  overrideDependencies(dependencies: (Job | JobCollection | Need)[]): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_needs()` to all jobs within the first
   * stage of this sequence that haven't been added needs before.
   *
   * An empty parameter list means that jobs will get an empty dependency
   * list and thus does not depend on other jobs by default.
   *
   * @param needs ???
   */
  initializeNeeds(needs: Array<Need | Job | JobCollection>): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_needs()` to all jobs within the first stage
   * of this sequence and overriding any previously added needs to that jobs.
   *
   * An empty parameter list means that jobs will get an empty dependency list
   * and thus does not depend on other jobs.
   *
   * @param needs ???
   */
  overrideNeeds(needs: Array<Need | Job | JobCollection>): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_image()` to all jobs within this sequence.
   * @param image ???
   */
  initializeImage(image: Image | string): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_image()` to all jobs within this sequence
   * overriding any previous set value.
   * @param image ???
   */
  overrideImage(image: Image | string): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_allow_failure()` to all jobs within this
   * sequence that haven't been set the allow_failure before.
   *
   * @param allowFailure ???
   * @returns the modified `JobCollection` object.
   */
  initializeAllowFailure(allowFailure: boolean | number[]): JobCollection;
  /**
   * Calling `gcip.core.job.Job.set_allow_failure()` to all jobs within this
   * sequence overriding any previous set value.
   *
   * @param allowFailure ???
   * @returns the modified `JobCollection` object.
   */
  overrideAllowFailure(allowFailure: boolean | number[]): JobCollection;
  /**
   *
   * @param parent
   */
  addParent(parent: JobCollection): void;

}

/**
 * A Sequence collects multiple `gcip.core.job.Job`s and/or other
 * `gcip.core.sequence.Sequence`s into a group.
 */
export class JobCollection implements IJobCollection {
  parents: (Job | JobCollection)[] = [];
  children: ChildDict[] = [];
  allowFailureForInitialization?: string | boolean | number[];
  allowFailureForReplacement?: string | boolean | number[];
  variables?: Variables;
  variablesForInitialization?: Variables;
  variablesForReplacement?: Variables;
  cache?: Cache;
  cacheForInitialization?: Cache;
  artifacts?: Artifacts;
  artifactsForInitialization?: Artifacts;
  artifactsForReplacement?: Artifacts;
  orderedTags: OrderedStringSet = new OrderedStringSet();
  orderedTagsForInitialization: OrderedStringSet = new OrderedStringSet();
  orderedTagsForReplacement: OrderedStringSet = new OrderedStringSet();
  rulesToAppend?: Rule[];
  rulesToPrepend?: Rule[];
  rulesForInitialization?: Rule[];
  rulesForReplacement?: Rule[];
  dependencies?: (Job | JobCollection | Need)[];
  dependenciesForInitialization?: (Job | JobCollection | Need)[];
  dependenciesForReplacement?: (Job | JobCollection | Need)[];
  needs?: (Need | Job | JobCollection)[];
  needsForInitialization?: (Need | Job | JobCollection)[];
  needsForReplacement?: (Need | Job | JobCollection)[];
  scriptsToPrepend?: string[] = [];
  scriptsToAppend?: string[] = [];
  imageForInitialization?: Image | string;
  imageForReplacement?: Image | string;

  constructor() {}

  initializeAllowFailure(allowFailure: boolean | number[]): JobCollection {
    this.allowFailureForInitialization = allowFailure;
    return this;
  }
  overrideAllowFailure(allowFailure: boolean | number[]): JobCollection {
    this.allowFailureForReplacement = allowFailure;
    return this;
  }
  addVariables(variables: Variables): JobCollection {
    this.variables = { ...this.variables, ...variables };
    return this;
  }
  initializeVariables(variables: Variables): JobCollection {
    this.variablesForInitialization = { ...this.variablesForInitialization, ...variables };
    return this;
  }
  overrideVariables(variables: Variables): JobCollection {
    this.variablesForReplacement = { ...this.variablesForReplacement, ...variables };
    return this;
  }
  assignCache(cache: Cache): JobCollection {
    this.cache = cache;
    return this;
  }
  initializeCache(cache: Cache): JobCollection {
    this.cacheForInitialization = cache;
    return this;
  }
  assignArtifacts(artifacts: Artifacts): JobCollection {
    this.artifacts = artifacts;
    return this;
  }
  initializeArtifacts(artifacts: Artifacts): JobCollection {
    this.artifactsForInitialization = artifacts;
    return this;
  }
  /**
   * @description Calling `gcip.core.job.Job.add_tags()` to all jobs within this sequence.
   */
  addTags(tags: string[]): JobCollection {
    for (const tag of tags) {
      this.orderedTags.add(tag);
    }
    return this;
  }
  initializeTags(tags: string[]): JobCollection {
    for (const tag of tags) {
      this.orderedTagsForInitialization.add(tag);
    }
    return this;
  }
  overrideTags(tags: string[]): JobCollection {
    for (const tag of tags) {
      this.orderedTagsForReplacement.add(tag);
    }
    return this;
  }
  appendRules(rules: Rule[]): JobCollection {
    if (this.rulesToAppend) {
      this.rulesToAppend = [...this.rulesToAppend, ...rules];
    } else {
      this.rulesToAppend = rules;
    }
    return this;
  }
  prependRules(rules: Rule[]): JobCollection {
    if (this.rulesToPrepend) {
      this.rulesToPrepend = [...rules, ...this.rulesToPrepend];
    } else {
      this.rulesToPrepend = rules;
    }
    return this;
  }
  initializeRules(rules: Rule[]): JobCollection {
    if (this.rulesForInitialization) {
      this.rulesForInitialization = [...this.rulesForInitialization, ...rules];
    } else {
      this.rulesForInitialization = rules;
    }
    return this;
  }
  overrideRules(rules: Rule[]): JobCollection {
    if (this.rulesForReplacement) {
      this.rulesForReplacement = [...this.rulesForReplacement, ...rules];
    } else {
      this.rulesForReplacement = rules;
    }
    return this;
  }
  addDependencies(dependencies: (Job | JobCollection | Need)[]): JobCollection {
    if (this.dependencies) {
      this.dependencies = [...this.dependencies, ...dependencies];
    } else {
      this.dependencies = dependencies;
    }
    return this;
  }
  initializeDependencies(dependencies: (Job | JobCollection | Need)[]): JobCollection {
    this.dependenciesForInitialization = dependencies;
    return this;
  }
  overrideDependencies(dependencies: (Job | JobCollection | Need)[]): JobCollection {
    this.dependenciesForReplacement = dependencies;
    return this;
  }
  addNeeds(needs: (Job | JobCollection | Need)[]): JobCollection {
    if (this.needs) {
      this.needs = [...this.needs, ...needs];
    } else {
      this.needs = needs;
    }
    return this;
  }
  initializeNeeds(needs: (Job | JobCollection | Need)[]): JobCollection {
    this.needsForInitialization = needs;
    return this;
  }
  overrideNeeds(needs: (Job | JobCollection | Need)[]): JobCollection {
    this.needsForReplacement = needs;
    return this;
  }
  prependScripts(scripts: string[]): JobCollection {
    if (this.scriptsToPrepend) {
      this.scriptsToPrepend = [...scripts, ...this.scriptsToPrepend];
    }
    return this;
  }
  appendScripts(scripts: string[]): JobCollection {
    if (this.scriptsToAppend) {
      this.scriptsToAppend = [...this.scriptsToAppend, ...scripts];
    }
    return this;
  }
  initializeImage(image: string | Image): JobCollection {
    this.imageForInitialization = image;
    return this;
  }
  overrideImage(image: string | Image): JobCollection {
    this.imageForReplacement = image;
    return this;
  }
  addChildren(props: AddChildrenProps): JobCollection {
    for (const child of props.jobsOrJobCollections) {
      child.addParent(this);
      this.children.push({ child: child, stage: props.stage, name: props.name });
    }
    return this;
  }
  getAllInstanceNames(child?: Job | JobCollection): OrderedStringSet {
    // first get all instance names from parents of this sequence
    const ownInstanceNames: OrderedStringSet = new OrderedStringSet();
    for (const parent of this.parents) {
      ownInstanceNames.add(parent.getAllInstanceNames(this).values);
    }

    // second get all instance names of the child within this sequence
    const childInstanceNames: OrderedStringSet = new OrderedStringSet();
    for (const item of this.children) {
      if (item.child === child) {
        let childInstanceName: string = '';
        let childName = item.name;
        let childStage = item.stage;
        if (childStage) {
          if (childName) {
            childInstanceName = `${childName}-${childStage}`;
          }
        } else if (childName) {
          childInstanceName = childName;
        } else {
          childInstanceName = '';
        }
        childInstanceNames.add(childInstanceName);
      }
    }

    // third combine all instance names of this sequences
    // with all instance names of the child
    let return_values: OrderedStringSet = new OrderedStringSet();
    if (ownInstanceNames.values.length) {
      for (const childInstanceName of childInstanceNames) {
        for (const instanceName of ownInstanceNames) {
          if (childInstanceName && instanceName) {
            return_values.add(`${instanceName}-${childInstanceName}`);
          } else if (childInstanceName) {
            return_values.add(childInstanceName);
          } else {
            return_values.add(instanceName);
          }
        }
      }
    } else {
      return_values = childInstanceNames;
    }
    return return_values;
  }
  addParent(parent: JobCollection): void {
    this.parents.push(parent);
  }
  get populatedJobs(): Job[] {
    const allJobs: Job[] = [];
    for (const item of this.children) {
      let child = item.child;
      let childName = item.name;
      let childStage = item.stage;
      if (child instanceof JobCollection) {
        for (const jobCopy of child.populatedJobs) {
          if (childStage) {
            jobCopy.extendStage(childStage);
          }
          if (childName) {
            jobCopy.extendName(childName);
          }
          allJobs.push(jobCopy);
        }
      } else if (child instanceof Job) {
        const jobCopy = child.copy();
        if (childStage) {
          jobCopy.extendStage(childStage);
        }
        if (childName) {
          jobCopy.extendName(childName);
        }
        allJobs.push(jobCopy);
      }
    }

    if (allJobs.length) {
      const firstJob = allJobs[0];
      if (!firstJob.needs && this.needsForInitialization) {
        firstJob.assignNeeds(deepcopy(this.needsForInitialization));
      }
      if (this.needsForReplacement) {
        firstJob.assignNeeds(deepcopy(this.needsForReplacement));
      }
      if (this.needs) {
        firstJob.addNeeds(deepcopy(this.needs));
      }
      for (const job of allJobs.slice(1)) {
        if (job.stage === firstJob.stage) {
          if (this.needsForInitialization && !job.needs) {
            job.assignNeeds(deepcopy(this.needsForInitialization));
          }
          if (this.needsForReplacement) {
            job.assignNeeds(deepcopy(this.needsForReplacement));
          }
          if (this.needs) {
            job.addNeeds(deepcopy(this.needs));
          }
        }
      }
    }

    for (const job of allJobs) {
      if (this.imageForInitialization && !job.image) {
        job.assignImage(deepcopy(this.imageForInitialization));
      }
      if (this.imageForReplacement) {
        job.assignImage(deepcopy(this.imageForReplacement));
      }
      if (this.allowFailureForInitialization && this.allowFailureForInitialization !== 'untouched' && job.allowFailure === 'untouched') {
        job.allowFailure = this.allowFailureForInitialization;
      }
      if (this.allowFailureForReplacement && this.allowFailureForReplacement !== 'untouched') {
        job.allowFailure = this.allowFailureForReplacement;
      }

      if (this.variablesForInitialization && !job.variables) {
        job.variables = deepcopy(this.variablesForInitialization);
      }
      if (this.variablesForReplacement) {
        job.variables = deepcopy(this.variablesForReplacement);
      }
      if (this.variables) {
        job.addVariables(deepcopy(this.variables));
      }

      if (this.cacheForInitialization && !job.cache) {
        job.cache = deepcopy(this.cacheForInitialization);
      }
      if (this.cache) {
        job.assignCache(deepcopy(this.cache));
      }

      if (this.artifactsForInitialization && (!job.artifacts?.paths && !job.artifacts?.reports)) {
        job.artifacts = deepcopy(this.artifactsForInitialization);
      }
      if (this.artifactsForReplacement) {
        job.artifacts = deepcopy(this.artifactsForReplacement);
      }
      if (this.artifacts) {
        job.assignArtifacts(deepcopy(this.artifacts));
      }

      if (this.dependenciesForInitialization && !job.dependencies) {
        job.assignDependencies(deepcopy(this.dependenciesForInitialization));
      }
      if (this.dependenciesForReplacement) {
        job.assignDependencies(deepcopy(this.dependenciesForReplacement));
      }
      if (this.dependencies) {
        job.addDependencies(deepcopy(this.dependencies));
      }

      if (this.orderedTagsForInitialization.size && !job.orderedTags.size) {
        job.orderedTags = deepcopy(this.orderedTagsForInitialization);
      }
      if (this.orderedTagsForReplacement.size) {
        job.orderedTags = deepcopy(this.orderedTagsForInitialization);
      }
      job.addTags(deepcopy(this.orderedTags.values));

      if (this.rulesForInitialization && !job.rules) {
        job.rules = deepcopy(this.rulesForInitialization);
      }
      if (this.rulesForReplacement) {
        job.rules = deepcopy(this.rulesForReplacement);
      }
      if (this.rulesToAppend) {
        job.appendRules(deepcopy(this.rulesToAppend));
      }
      if (this.rulesToAppend) {
        job.prependRules(deepcopy(this.rulesToPrepend));
      }
      job.appendScripts(deepcopy(this.scriptsToAppend));
      job.prependScripts(deepcopy(this.scriptsToPrepend));
    }
    return allJobs;
  }
  get lastJobsExecuted(): Job[] {
    const allJobs = this.populatedJobs;
    const stages: OrderedStringSet = new OrderedStringSet();
    for (const job of allJobs) {
      stages.add(job.stage);
    }

    const lastStage: string = stages.values[stages.size - 1];
    const lastExecutedJobs: Job[] = [];
    for (const job of allJobs) {
      if (job.stage === lastStage) {
        if (job.original) {
          lastExecutedJobs.push(job.original);
        } else {
          throw Error('`job.original` is undefined, bacause the `job` is not a copy of another job.');
        }
      }
    }
    return lastExecutedJobs;
  }
  get nestedJobs(): Job[] {
    const allJobs: Job[] = [];
    for (const item of this.children) {
      const child = item.child;
      if (child instanceof Job) {
        allJobs.push(child);
      } else if (child instanceof JobCollection) {
        allJobs.push(...child.nestedJobs);
      } else {
        throw new Error(`Unexpected error. JobCollection child is of unknown type '${typeof child}'`);
      }
    }
    return allJobs;
  }
  render(): any {
    return this;
  }
  isEqual(comparable: IBase): comparable is IBase {
    return this.render() === comparable.render();
  }
}
