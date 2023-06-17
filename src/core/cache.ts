/**
 * This module represents the Gitlab CI [cache](https://docs.gitlab.com/ee/ci/yaml/#cache) keyword
 *
 * Simple example:
 *
 * ```ts
 * from gcip import Job, Cache
 *
 * job1 = Job(stage="buildit", script="build my app")
 * job1.set_cache(Cache(["file1.txt", "file2.txt", "path/to/file3.txt"]))
 * ```
 *
 * More complex example:
 *
 * ```ts
 * from gcip import Job, Cache, CacheKey, CachePolicy, WhenStatement
 *
 * files = ["file1.txt", "file2.txt", "path/to/file3.txt"]
 *
 * job1 = Job(stage="buildit", script="build my app")
 * job1.set_cache(Cache(
 *     files,
 *     cache_key=CacheKey(files=files),
 *     when=WhenStatement.ALWAYS,
 *     policy=CachePolicy.PULL_PUSH)
 * )
 * ```
 */

import { IBase, PredefinedVariables, WhenStatement } from '.';

/**
 * This class represents the [cache:policy](https://docs.gitlab.com/ee/ci/yaml/#cachepolicy) keyword.
 * The policy determines if a Job can modify the cache or read him only.
 */
export enum CachePolicy {
  /**
     * The default behavior of a caching job is to download the files at the start of execution, and to
     * re-upload them at the end. Any changes made by the job are persisted for future runs.
     */
  PULLPUSH = 'pull-push',
  /**
     * If you know the job does not alter the cached files, you can skip the upload step by setting this policy in the job specification.
     */
  PULL = 'pull'
}

/**
 * @internal
 */
export interface RenderedCacheKey {

}

export interface CacheKeyProps {
  /**
     * @description The key is the unique id of the cache. `gcip.job.Job`s
     * referencing caches with the same key are sharing the cache contents.
     * Mutually exclusive with `files`
     * @default gcip.core.variables.PredefinedVariables.CI_COMMIT_REF_SLUG
     */
  readonly key?: string;
  /**
     * @description A set of files is another way to define a caches unique id.
     * Jobs referencing caches with the same set of files are sharing the cache
     * contents.
     *
     * The [cache:key:files](https://docs.gitlab.com/ee/ci/yaml/#cachekeyfiles)
     * keyword extends the cache:key functionality by making it easier to reuse
     * some caches, and rebuild them less often, which speeds up subsequent
     * pipeline runs. Mutually exclusive with `keys`. Defaults to None.
     */
  readonly files?: string[];
  /**
     * @description prefixed given `files` to allow creation of caches
     * for branches.
     */
  prefix?: string;

}

export interface ICacheKey extends IBase {

}

/** This class represents the [cache:key](https://docs.gitlab.com/ee/ci/yaml/#cachekey) keyword.

    Gitlab CI documentation: _"The key keyword defines the affinity of caching between jobs. You can have a single cache for
    all jobs, cache per-job, cache per-branch, or any other way that fits your workflow."_


    Raises:
        ValueError: If both `key` and `files` are provided.
        ValueError: If both `key` and `prefix` are provided.
        ValueError: If `prefix` but not `files` is provided.
        ValueError: If `key` is only made out of dots '.'.
*/
export class CacheKey implements ICacheKey {
  key?: string;
  files?: string[];
  prefix?: string;

  constructor(props: CacheKeyProps) {
    this.key = props.key;
    this.files = props.files;
    this.prefix = props.prefix;

    if (this.key && this.files) {
      throw Error('Parameters key and files are mutually exclusive.');
    } else if (this.prefix && !this.files) {
      throw Error('Parameter \'prefix\' can only be used together with \'files\'.');
    }

    if (!this.files && !this.key) {
      this.key = PredefinedVariables.CI_COMMIT_REF_SLUG;
    }
    if (this.key) {
      //Forward slash and dot aren't allowed for cache key,
      //therefore replacing both by '_' and '-'.
      this.key = this.key.replace(/\//gm, '_').replace(/\./gm, '-');
    }
  }

  /**
   * @returns RenderedCacheKey
   */
  render(): any {
    const rendered: RenderedCacheKey = {
      key: this.key,
      files: this.files,
      prefix: this.prefix,
    };
    return rendered;
  }

  /**
   * isEqual checks if `this` object is equal to given object
   *
   * @param comparable An arbitrary object to compare to.
   * @returns boolean
   */
  isEqual(comparable: CacheKey): boolean {
    return this.render() === comparable.render();
  }
}

/**
 * @internal
 */
export interface RenderedCache {
  cache: {
    paths: string[];
    when: string;
    untracked: boolean;
    policy: string;
    key: CacheKey;
  };
}

export interface CacheProps {
  /**
   * @description  Use the [paths directive](https://docs.gitlab.com/ee/ci/yaml/#cachepaths)
   * to choose which files or directories to cache.
   */
  paths: string[];
  /**
   * @description The key keyword defines the affinity of caching between jobs.
   * @default to `CacheKey` with default arguments.
   */
  cacheKey?: CacheKey;
  /**
   * Set the [untracked keyword](https://docs.gitlab.com/ee/ci/yaml/#cacheuntracked)
   * to `True` to cache all files that are untracked in your Git repository.
   */
  untracked?: boolean;
  /**
   * @description [This keyword](https://docs.gitlab.com/ee/ci/yaml/#cachewhen)
   * defines when to save the cache, depending on job status.
   * Possible values are `gcip.core.rule.WhenStatement.ON_SUCCESS`,
   * `gcip.core.rule.WhenStatement.ON_FAILURE`,
   * `gcip.core.rule.WhenStatement.ALWAYS`.
   */
  when?: WhenStatement;
  /**
   * @description The `CachePolicy` determines if a Job can modify the cache
   * or read him only.
   */
  policy?: CachePolicy;
}

export interface ICache extends IBase {

}

/**
 * This class represents the [cache](https://docs.gitlab.com/ee/ci/yaml/#cache) keyword.
 *
 * Gitlab CI documentation:
 *
 * _"Use cache to specify a list of files and directories to cache between
 * `gcip.core.job.Job`s. [...] Caching is shared between
 * `gcip.core.pipeline.Pipeline`s and `gcip.core.job.Job`s.
 * Caches are restored before artifacts."_
 *
 * @throws `Error` for unsupported `when` values.
 */
export class Cache implements ICache {
  paths: string[];
  cacheKey: CacheKey;
  untracked: boolean | undefined;
  when: WhenStatement | undefined;
  policy: CachePolicy | undefined;

  constructor(props: CacheProps) {
    this.paths = [];
    // Get default CacheKey = PredefinedVariables.CI_COMMIT_REF_SLUG
    this.cacheKey = props.cacheKey ?? new CacheKey({});
    this.untracked = props.untracked;
    this.when = props.when;
    this.policy = props.policy;

    /**
   * Remove project path prefix from paths given.
   * Prepend ./ to path to clearify that cache paths
   * are relative to CI_PROJECT_PATH
   */
    props.paths.forEach((path) => {
      path = path.replace(PredefinedVariables.CI_PROJECT_DIR, '');
      if (!path.startsWith('./')) {
        path = './' + path;
        this.paths.push(path);
      };

      const allowedWhenStatements = [
        WhenStatement.ALWAYS,
        WhenStatement.ONFAILURE,
        WhenStatement.ONSUCCESS,
      ];

      if (this.when && !allowedWhenStatements.includes(this.when)) {
        throw Error(`${this.when} is not allowed. Allowed when statements: ${allowedWhenStatements}`);
      }
    });
  }

  /**
   * @returns RenderedCache
   */
  render(): any {
    const rendered = {
      cache: {
        paths: this.paths,
        when: this.when,
        untracked: this.untracked,
        policy: this.policy,
        key: this.cacheKey.render(),
      },
    };
    return rendered;
  }

  /**
   * isEqual checks if `this` object is equal to given object
   *
   * @param comparable An arbitrary object to compare to.
   * @returns boolean
   */
  isEqual(comparable: Cache): boolean {
    return this.render() === comparable.render();
  }
}
