/**
 * This module represents the Gitlab CI [artifacts](https://docs.gitlab.com/ee/ci/yaml/#artifacts) keyword
 *
 * Simple example:
 *
 * ```
 * from gcip import Artifact, ArtifactReport
 *
 * files = ["file1.txt", "file2.txt", "path/to/file3.txt"]
 *
 * job1 = Job(stage="buildit", script="build my app")
 * job1.artifacts.add_paths(files)
 * ```
 */

import { IBase, OrderedStringSet, PredefinedVariables, WhenStatement } from '.';
import { sanitizePath } from '../helper';

/**
 * @internal
 */
export interface RenderdArtifacts {
  readonly paths?: string[];
  readonly excludes?: string[];
  readonly expire_in?: string;
  readonly expose_as?: string;
  readonly name?: string;
  readonly public?: boolean;
  readonly untracked?: boolean;
  readonly when?: WhenStatement;
  readonly reports?: {[key: string]: string};
}

/**
 * This interface represents the [artifacts:reports](https://docs.gitlab.com/ee/ci/yaml/#artifactsreports) types.
 */
export type ArtifactsReportType = 'accessibility' | 'api_fuzzing' |
'browser_performance' | 'coverage_report' | 'codequality' |
'container_scanning' | 'coverage_fuzzing' | 'cyclonedx' | 'dast' |
'dependency_scanning' | 'dotenv' | 'junit' | 'license_scanning' |
'load_performance' | 'metrics' | 'requirements' | 'sast' |
'secret_detection' | 'terraform';

export interface ArtifactsReport {
  /**
   * https://docs.gitlab.com/ee/ci/yaml/artifacts_reports.html
   * ArtifactsReport type to use.
   */
  reportType: ArtifactsReportType;
  /**
   * Relative path withing the project, where to find the generated report file
   */
  file: string;
}

export interface ArtifactsProps {
  /**
   * Paths relative to project directory `$CI_PROJECT_DIR`, found files
   * will be used to create the artifacts.
   */
  readonly paths?: string[];
  /**
   * Paths that prevent files from being added to an artifacts archive.
   */
  readonly excludes?: string[];
  /**
   * How long the artifacts will be saved before it gets deleted.
   */
  readonly expireIn?: string;
  /**
   * Used to expose artifacts in merge requests.
   */
  readonly exposeAs?: string;
  /**
   * Name of the artifacts archive.
   * Internally defaults to {PredefinedVariables.CI_JOB_NAME}-{PredefinedVariables.CI_COMMIT_REF_SLUG}.
   */
  readonly name?: string;
  /**
   * True makes artifacts public.
   */
  readonly public?: boolean;
  /**
   * Reports must be a valid dictionary, the key represents a ArtifactsReport
   * and the value must be a valid relativ file path to the reports file.
   */
  readonly reports?: ArtifactsReport[];
  /**
   * If true adds all untracked file to artifacts archive.
   */
  readonly untracked?: boolean;
  /**
   * When to upload artifacts, Only `on_success`, `on_failure` or `always` is allowed.
   */
  readonly when?: WhenStatement;
}

export interface IArtifacts extends IBase {
  readonly paths: string[];
  readonly excludes: string[];
  readonly expireIn?: string;
  readonly exposeAs?: string;
  readonly name?: string;
  readonly public?: boolean;
  readonly untracked?: boolean;
  readonly when?: WhenStatement;
  readonly reports?: ArtifactsReport[];
  addPaths(paths: string[]): void;
  addExcludes(excludes: string[]): void;
}

/**
 * This class represents the [artifacts](https://docs.gitlab.com/ee/ci/yaml/#artifacts) keyword.
 *
 * Gitlab CI documentation: _"Use artifacts to specify a list of files and
 * directories that are attached to the `gcip.core.job.Job` when it succeeds,
 * fails, or always. [...] by default, `gcip.core.job.Job`s in later stages
 * automatically download all the artifacts created by jobs in earlier stages.
 * You can control artifact download behavior in jobs with dependencies."_
 *
 * @raises Error if when is not `on_success`, `on_failure` or `always`.
 */
export class Artifacts implements IArtifacts {
  orderedPaths: OrderedStringSet;
  orderedExcludes: OrderedStringSet;
  expireIn: string | undefined;
  exposeAs: string | undefined;
  name: string | undefined;
  public: boolean | undefined;
  untracked: boolean | undefined;
  when: WhenStatement | undefined;
  reports?: ArtifactsReport[];

  constructor(props: ArtifactsProps) {
    this.orderedPaths = new OrderedStringSet();
    this.orderedExcludes = new OrderedStringSet();
    this.expireIn = props.expireIn;
    this.exposeAs = props.exposeAs;
    this.name = props.name ? props.name : `${PredefinedVariables.CI_JOB_NAME}-${PredefinedVariables.CI_COMMIT_REF_SLUG}`;
    this.public = props.public;
    this.reports = props.reports;
    this.untracked = props.untracked;
    this.when = props.when;

    if (props.paths) {
      props.paths.forEach((element) => {
        this.orderedPaths.add(sanitizePath(element));
      });
    }

    if (props.excludes) {
      props.excludes.forEach((element) => {
        this.orderedExcludes.add(sanitizePath(element));
      });
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

  get paths() {
    return this.orderedPaths.values;
  }
  get excludes() {
    return this.orderedExcludes.values;
  }

  public addPaths(paths: string[]) {
    paths.forEach((element) => {
      this.orderedPaths.add(element);
    });
  }

  public addExcludes(excludes: string[]) {
    excludes.forEach((element) => {
      this.orderedExcludes.add(element);
    });
  }

  /**
   * @returns RenderdArtifacts
   */
  render(): any {
    if (!this.orderedPaths.size && !this.reports) {
      return {};
    }
    const rendered: RenderdArtifacts = {
      name: this.name,
      paths: this.orderedPaths.values.length ? this.orderedPaths.values : undefined,
      excludes: this.orderedExcludes.values.length ? this.orderedExcludes.values : undefined,
      expire_in: this.expireIn,
      expose_as: this.exposeAs,
      public: this.public,
      reports: this.reports ? this.reports.reduce((acc: {[key: string]: string}, item) => {
        acc[item.reportType] = item.file;
        return acc;
      }, {}) : undefined,
      untracked: this.untracked,
      when: this.when,
    };
    return rendered;
  }

  isEqual(comparable: IBase): comparable is Artifacts {
    return JSON.stringify(this.render()) === JSON.stringify(comparable.render());
  }
}
