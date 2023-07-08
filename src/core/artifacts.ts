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

import { IBase, OrderedStringSet, WhenStatement } from '.';
import { sanitizePath } from '../helper';

/**
 * @internal
 */
export interface RenderdArtifacts {
  readonly paths: string[];
  readonly excludes: string[];
  readonly expire_in?: string;
  readonly expose_as?: string;
  readonly name?: string;
  readonly public?: boolean;
  readonly untracked?: boolean;
  readonly when?: WhenStatement;
  readonly reports?: ArtifactsReport;
}
/**
 * This class represents the [artifacts:reports](https://docs.gitlab.com/ee/ci/yaml/#artifactsreports) types.
 */
export enum ArtifactsReport {
  /**
   The api_fuzzing report collects API Fuzzing bugs as artifacts.
   */
  API_FUZZING = 'api_fuzzing',

  /**
   * The cobertura report collects Cobertura coverage XML files.
   */
  COBERTURA = 'cobertura',

  /**
   * The codequality report collects Code Quality issues as artifacts.
   */
  CODEQUALITY = 'codequality',

  /**
   * The container_scanning report collects Container Scanning vulnerabilities as artifacts.
   */
  CONTAINER_SCANNING = 'container_scanning',

  /**
   * The coverage_fuzzing report collects coverage fuzzing bugs as artifacts.
   */
  COVERAGE_FUZZING = 'coverage_fuzzing',

  /**
   * The dast report collects DAST vulnerabilities as artifacts.
   */
  DAST = 'dast',

  /**
   * The dependency_scanning report collects Dependency Scanning vulnerabilities as artifacts.
   */
  DEPENDENCY_SCANNING = 'dependency_scanning',

  /**
   * The dotenv report collects a set of environment variables as artifacts.
   */
  DOTENV = 'dotenv',

  /**
   * The junit report collects JUnit report format XML files as artifacts.
   */
  JUNIT = 'junit',

  /**
   * The license_scanning report collects Licenses as artifacts.
   */
  LICENSE_SCANNING = 'license_scanning',

  /**
   * The load_performance report collects Load Performance Testing metrics as artifacts.
   */
  LOAD_PERFORMANCE = 'load_performance',

  /**
   * The metrics report collects Metrics as artifacts.
   */
  METRICS = 'metrics',

  /**
   * The performance report collects Browser Performance Testing metrics as artifacts.
   */
  PERFORMANCE = 'performance',

  /**
   * The requirements report collects requirements.json files as artifacts.
   */
  REQUIREMENTS = 'requirements',

  /**
   * The sast report collects SAST vulnerabilities as artifacts.
   */
  SAST = 'sast',

  /**
   * The secret-detection report collects detected secrets as artifacts.
   */
  SECRET_DETECTION = 'secret_detection',

  /**
   * The terraform report obtains a Terraform tfplan.json file.
   */
  TERRAFORM = 'terraform',
}

export interface ArtifactsProps {
  /**
   * Paths relative to project directory `$CI_PROJECT_DIR`, found files
   * will be used to create the artifacts.
   */
  readonly paths: string[];
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
  readonly reports?: ArtifactsReport;
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
  reports: ArtifactsReport | undefined;

  constructor(props: ArtifactsProps) {
    this.orderedPaths = new OrderedStringSet();
    this.orderedExcludes = new OrderedStringSet();
    this.expireIn = props.expireIn;
    this.exposeAs = props.exposeAs;
    this.name = props.name;
    this.public = props.public;
    this.reports = props.reports;
    this.untracked = props.untracked;
    this.when = props.when;

    props.paths.forEach((element) => {
      this.orderedPaths.add(sanitizePath(element));
    });

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
    if (!this.orderedPaths && !this.reports) {
      return {};
    }
    const rendered: RenderdArtifacts = {
      name: this.name,
      paths: this.orderedPaths.values,
      excludes: this.orderedExcludes.values,
      expire_in: this.expireIn,
      expose_as: this.exposeAs,
      public: this.public,
      reports: this.reports,
      untracked: this.untracked,
      when: this.when,
    };
    return rendered;
  }

  isEqual(comparable: IBase): comparable is Artifacts {
    return this.render() === comparable.render();
  }
}
