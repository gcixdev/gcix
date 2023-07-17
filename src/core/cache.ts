/**
 * This module represents the Gitlab CI [cache](https://docs.gitlab.com/ee/ci/yaml/#cache) keyword
 *
 * Simple example:
 *
 * ```ts
 * import { Job, Cache } from "gcix";
 *
 * job1 = new Job({stage="buildit", scripts=["build my app"]})
 * job1.assignCache(new Cache({files: ["file1.txt", "file2.txt", "path/to/file3.txt"]}))
 * ```
 *
 * More complex example:
 *
 * ```ts
 * import { Job, Cache, CacheKey, CachePolicy, WhenStatement } from "gcix"
 *
 * const files = ["file1.txt", "file2.txt", "path/to/file3.txt"]
 *
 * job1 = new Job({stage="buildit", scripts=["build my app"]})
 * job1.assignCache(new Cache({
 *     files: files,
 *     cacheKey: new CacheKey({files: [files]}),
 *     when: WhenStatement.ALWAYS,
 *     policy: CachePolicy.PULLPUSH)
 * });
 * ```
 */

import { IBase, PredefinedVariables, WhenStatement } from ".";

/**
 * This enum represents the [cache:policy](https://docs.gitlab.com/ee/ci/yaml/#cachepolicy) keyword.
 * The policy determines if a Job can modify the cache or read him only.
 */
export enum CachePolicy {
  /**
   * The default behavior of a caching job is to download the files at the
   * start of execution and re-upload them at the end. This behavior ensures
   * that any changes made by the job are persisted for future runs.
   */
  PULLPUSH = "pull-push",
  /**
   * If you are certain that the job does not modify the cached files, you
   * can specify this policy to skip the upload step. By setting this policy,
   * the job will only download the cached files at the start of execution
   * without re-uploading them at the end.
   */
  PULL = "pull",
}

/**
 * @internal
 */
export interface RenderedCacheKey {
  key?: string;
  files?: string[];
  prefix?: string;
}

export interface CacheKeyProps {
  /**
   * @description The key is the unique id of the cache. `gcix.Job`s
   * referencing caches with the same key are sharing the cache contents.
   * Mutually exclusive with `files`
   * @default gcix.PredefinedVariables.CI_COMMIT_REF_SLUG
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
   * pipeline runs. Mutually exclusive with `keys`.
   */
  readonly files?: string[];
  /**
   * @description prefixed given `files` to allow creation of caches
   * for branches.
   */
  readonly prefix?: string;
}

export interface ICacheKey extends IBase {}

/** This class represents the [cache:key](https://docs.gitlab.com/ee/ci/yaml/#cachekey) keyword.
 *
 * Gitlab CI documentation: _"The key keyword defines the affinity of caching
 * between jobs. You can have a single cache for all jobs, cache per-job,
 * cache per-branch, or any other way that fits your workflow."_
 *
 * @throws Error if both `key` and `files` are provided.
 * @throws Error if `prefix` but not `files` is provided.
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
      throw new Error("Parameters key and files are mutually exclusive.");
    } else if (this.prefix && !this.files) {
      throw new Error(
        "Parameter 'prefix' can only be used together with 'files'.",
      );
    }

    if (!this.files && !this.key) {
      this.key = PredefinedVariables.CI_COMMIT_REF_SLUG;
    }
    if (this.key) {
      /**
       * Forward slash and dot aren't allowed for cache key,
       * therefore replacing both by '_' and '-'.
       */
      this.key = this.key.replace(/\//gm, "_").replace(/\./gm, "-");
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

  isEqual(comparable: IBase): comparable is CacheKey {
    return (
      JSON.stringify(this.render()) === JSON.stringify(comparable.render())
    );
  }
}

/**
 * @internal
 */
export interface RenderedCache {
  paths: string[];
  when: string;
  untracked: boolean;
  policy: string;
  key: CacheKey;
}

export interface CacheProps {
  /**
   * @description  Use the [paths directive](https://docs.gitlab.com/ee/ci/yaml/#cachepaths)
   * to choose which files or directories to cache.
   */
  readonly paths: string[];
  /**
   * @description The key keyword defines the affinity of caching between jobs.
   * @default to `CacheKey` with default arguments.
   */
  readonly cacheKey?: CacheKey;
  /**
   * Set the [untracked keyword](https://docs.gitlab.com/ee/ci/yaml/#cacheuntracked)
   * to `True` to cache all files that are untracked in your Git repository.
   */
  readonly untracked?: boolean;
  /**
   * @description [This keyword](https://docs.gitlab.com/ee/ci/yaml/#cachewhen)
   * defines when to save the cache, depending on job status.
   * Possible values are `gcix.WhenStatement.ON_SUCCESS`,
   * `gcix.WhenStatement.ON_FAILURE`,
   * `gcix.WhenStatement.ALWAYS`.
   */
  readonly when?: WhenStatement;
  /**
   * @description The `CachePolicy` determines if a Job can modify the cache
   * or read him only.
   */
  readonly policy?: CachePolicy;
}

export interface ICache extends IBase {}

/**
 * This class represents the [cache](https://docs.gitlab.com/ee/ci/yaml/#cache) keyword.
 *
 * Gitlab CI documentation:
 *
 * _"Use cache to specify a list of files and directories to cache between
 * `gcix.Job`s. [...] Caching is shared between
 * `gcix.Pipeline`s and `gcix.Job`s.
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
    for (let path of props.paths) {
      path = path.replace(PredefinedVariables.CI_PROJECT_DIR, "");
      if (!path.startsWith("./")) {
        path = "./" + path;
      }
      this.paths.push(path);
    }

    const allowedWhenStatements = [
      WhenStatement.ALWAYS,
      WhenStatement.ONFAILURE,
      WhenStatement.ONSUCCESS,
    ];
    if (this.when && !allowedWhenStatements.includes(this.when)) {
      throw new Error(
        `${this.when} is not allowed. Allowed when statements: ${allowedWhenStatements}`,
      );
    }
  }

  /**
   * @returns RenderedCache
   */
  render(): any {
    const rendered: any = {
      paths: this.paths,
      when: this.when,
      untracked: this.untracked,
      policy: this.policy,
    };

    const renderedCacheKey = this.cacheKey.render();
    if (renderedCacheKey.key) {
      rendered.key = renderedCacheKey.key;
    }
    return rendered;
  }

  isEqual(comparable: IBase): comparable is Cache {
    return (
      JSON.stringify(this.render()) === JSON.stringify(comparable.render())
    );
  }
}
