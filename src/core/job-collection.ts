/**
 * A JobCollection serves as a container for multiple `gcix.Job`s and/or other
 * `gcix.JobCollection`s, allowing you to group them together.
 *
 * While the concept of a JobCollection is not an official representation of a
 * GitLab CI keyword, it is a powerful extension of the GitLab CI core
 * functionality and a fundamental building block of the `gcix` module.
 *
 * A JobCollection offers a similar interface to `gcix.Job`s, allowing you to
 * modify all Jobs and child JobCollections contained within it. For example,
 * instead of calling `addTags()` on individual Jobs, you can call `addTags()`
 * on the JobCollection that contains those Jobs. This will apply the tags to
 * all Jobs in the JobCollection and recursively to all Jobs within child
 * JobCollections.
 *
 * It's important to note that JobCollections must be added to a
 * `gcix.Pipeline`, either directly or as part of another JobCollection.
 * JobCollections are not meant to be used as throwaway configuration
 * containers for a group of Jobs. When you add a Job to a JobCollection, a
 * copy of that Job is created and indirectly added to the Pipeline by the
 * JobCollection. If you don't add the JobCollection to a Pipeline, its Jobs
 * will not be added either. This can lead to broken dependencies if other
 * parts of the Pipeline rely on those Jobs.
 *
 * To avoid conflicts between Jobs, it's recommended to set the name and/or
 * stage when adding a Job (or child JobCollection) to a JobCollection.
 * The JobCollection will incorporate the name and stage values into the ones
 * of the Job when rendering the pipeline. If you don't set these identifiers
 * or set the same name/stage for multiple jobs and JobCollections, it can
 * result in multiple Jobs with the same name in the pipeline.
 * The gcix module will raise an Error in such cases to prevent unexpected
 * pipeline behavior. You can find more information in the
 * "Stages allow reuse of jobs and JobCollections" chapter of the user
 * documentation.
 */

import {
  IBase,
  OrderedStringSet,
  Variables,
  Artifacts,
  Cache,
  Image,
  Job,
  Need,
  Rule,
} from ".";
import { deepcopy } from "../helper";

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
   * JobCollection and all parent JobCollection's.
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
   * Returns a list with populated copies of all nested jobs of this
   * JobCollection.
   *
   * Populated means, that all attributes of a Job which depends on its context
   * are resolved to their final values. The context is primarily the
   * JobCollection within the jobs resides but also dependencies to other
   * jobs and JobCollection's. Thus this JobCollection will apply its own
   * configuration, like variables to add, tags to set, etc., to all its jobs
   * and JobCollection's.
   *
   * Copies means what it says, that the returned job are not the same job
   * objects, originally added to this JobCollection, but copies of them.
   *
   * Nested means, that also jobs from JobCollection's within this
   * JobCollection, are returned, as well as jobs from JobCollection's within
   * JobCollection's within this JobCollection and so on.
   */
  readonly populatedJobs: Job[];
  /**
   * This property returns all Jobs from the last stage of this JobCollection.
   *
   * This is typically be requested from a job which has setup this
   * JobCollection as need, to determine all actual jobs of this JobCollection
   * as need.
   */
  readonly lastJobsExecuted: Job[];
  /**
   * @returns all jobs of this this JobCollection as well as jobs of
   * sub-JobCollection recursively.
   */
  readonly nestedJobs: Job[];
  /**
   * Add `gcix.Job`s or other `gcix.JobCollection`s to this JobCollection.
   *
   * Adding a child creates a copy of that child. You should provide a name or
   * stage when adding children, to make them different from other places
   * where they will be used.
   *
   * @returns JobCollection of the modified `JobCollection` object.
   */
  addChildren(props: AddChildrenProps): JobCollection;
  /**
   * Calling `gcix.Job.addVariables({...})` to all jobs within this
   * JobCollection that haven't been added variables before.
   * @param variables ???
   */
  initializeVariables(variables: Variables): JobCollection;
  /**
   * Calling `gcix.Job.addVariables({...})` to all jobs within this
   * JobCollection and overriding any previously added variables to that jobs.
   * @param variables ???
   */
  overrideVariables(variables: Variables): JobCollection;
  /**
   * Calling `gcix.Job.assigneCache()` to all jobs within this JobCollection
   * that haven't been set the cache before.
   * @param cache ???
   */
  initializeCache(cache: Cache): JobCollection;
  /**
   * Sets `gcix.Job.artifacts` to all jobs within this JobCollection that
   * haven't been set the artifacs before.
   * @param artifacts ???
   */
  initializeArtifacts(artifacts: Artifacts): JobCollection;
  /**
   * Calling `gcix.Job.addTags([...])` to all jobs within this JobCollection
   * that haven't been added tags before.
   * @param tags ???
   */
  initializeTags(tags: string[]): JobCollection;
  /**
   * Calling `gcix.Job.addTags([...])` to all jobs within this JobCollection
   * and overriding any previously added tags to that jobs.
   * @param tags ???
   */
  overrideTags(tags: string[]): JobCollection;
  /**
   * Calling `gcix.Job.append_rules()` to all jobs within this
   * JobCollection that haven't been added rules before.
   * @param rules ???
   */
  initializeRules(rules: Rule[]): JobCollection;
  /**
   * Calling `gcix.Job.overrideRules()` to all jobs within this
   * JobCollection and overriding any previously added rules to that jobs.
   * @param rules ???
   */
  overrideRules(rules: Rule[]): JobCollection;
  /**
   * Calling `gcix.Job.assignDependencies()` to all jobs within the
   * first stage of this JobCollection that haven't been added dependencies
   * before.
   *
   * An empty parameter list means that jobs will get an empty dependency
   * list and thus does not download artifacts by default.
   * @param dependencies ???
   */
  initializeDependencies(
    dependencies: (Job | JobCollection | Need)[],
  ): JobCollection;
  /**
   * Calling `gcix.Job.assignDependencies()` to all jobs within the
   * first stage of this JobCollection and overriding any previously added
   * dependencies to that jobs.
   *
   * An empty parameter list means that jobs will get an empty dependency list
   * and thus does not download artifacts.
   * @param dependencies ???
   */
  overrideDependencies(
    dependencies: (Job | JobCollection | Need)[],
  ): JobCollection;
  /**
   * Calling `gcix.Job.assignNeeds()` to all jobs within the first
   * stage of this JobCollection that haven't been added needs before.
   *
   * An empty parameter list means that jobs will get an empty dependency
   * list and thus does not depend on other jobs by default.
   * @param needs ???
   */
  initializeNeeds(needs: Array<Need | Job | JobCollection>): JobCollection;
  /**
   * Calling `gcix.Job.assignNeeds()` to all jobs within the first stage
   * of this JobCollection and overriding any previously added needs to that
   * jobs.
   *
   * An empty parameter list means that jobs will get an empty dependency list
   * and thus does not depend on other jobs.
   *
   * @param needs ???
   */
  overrideNeeds(needs: Array<Need | Job | JobCollection>): JobCollection;
  /**
   * Calling `gcix.Job.assignImage()` to all jobs within this JobCollection.
   * @param image ???
   */
  initializeImage(image: Image | string): JobCollection;
  /**
   * Calling `gcix.Job.assignImage()` to all jobs within this JobCollection
   * overriding any previous set value.
   * @param image ???
   */
  overrideImage(image: Image | string): JobCollection;
  /**
   * Calling `gcix.Job.assignAllowFailure()` to all jobs within this
   * JobCollection that haven't been set the allowFailure before.
   *
   * @param allowFailure ???
   * @returns the modified `JobCollection` object.
   */
  initializeAllowFailure(allowFailure: boolean | number[]): JobCollection;
  /**
   * Calling `gcix.Job.assignAllowFailure()` to all jobs within this
   * JobCollection overriding any previous set value.
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
 * A JobCollection collects multiple `gcix.Job`s and/or other
 * `gcix.JobCollection`s into a group.
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
    this.variablesForInitialization = {
      ...this.variablesForInitialization,
      ...variables,
    };
    return this;
  }
  overrideVariables(variables: Variables): JobCollection {
    this.variablesForReplacement = {
      ...this.variablesForReplacement,
      ...variables,
    };
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
  initializeDependencies(
    dependencies: (Job | JobCollection | Need)[],
  ): JobCollection {
    this.dependenciesForInitialization = dependencies;
    return this;
  }
  overrideDependencies(
    dependencies: (Job | JobCollection | Need)[],
  ): JobCollection {
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
      this.children.push({
        child: child,
        stage: props.stage,
        name: props.name,
      });
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
        let childInstanceName: string = "";
        let childName = item.name;
        let childStage = item.stage;
        if (childStage) {
          if (childName) {
            childInstanceName = `${childName}-${childStage}`;
          } else {
            childInstanceName = childStage;
          }
        } else if (childName) {
          childInstanceName = childName;
        } else {
          childInstanceName = "";
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
      if (
        this.allowFailureForInitialization &&
        this.allowFailureForInitialization !== "untouched" &&
        job.allowFailure === "untouched"
      ) {
        job.allowFailure = this.allowFailureForInitialization;
      }
      if (
        this.allowFailureForReplacement &&
        this.allowFailureForReplacement !== "untouched"
      ) {
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

      if (
        this.artifactsForInitialization &&
        !job.artifacts?.paths &&
        !job.artifacts?.reports
      ) {
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
        job.orderedTags = deepcopy(this.orderedTagsForReplacement);
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
      if (this.rulesToPrepend) {
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
          throw Error(
            "`job.original` is undefined, bacause the `job` is not a copy of another job.",
          );
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
        throw new Error(
          `Unexpected error. JobCollection child is of unknown type '${typeof child}'`,
        );
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
