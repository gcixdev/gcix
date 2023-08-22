import { Job } from "../";

export interface Flake8Props {
  /**
   * The name of the job.
   */
  readonly jobName?: string;
  /**
   * The stage of the job.
   */
  readonly jobStage?: string;
}

export interface IFlake8 {}

/**
 * Runs:
 *
 * ```
 * pip3 install --upgrade flake8
 * flake8
 * ```
 *
 * This subclass of `Job` configures the following defaults for the superclass:
 * - name: flake8
 * - stage: lint
 */
export class Flake8 extends Job implements IFlake8 {
  constructor(props: Flake8Props) {
    super({
      scripts: ["pip3 install --upgrade flake8", "flake8"],
      name: props.jobName ?? "flake8",
      stage: props.jobStage ?? "lint",
    });
  }
}

export interface MyPyProps {
  /**
   * The name of the job.
   */
  readonly jobName?: string;
  /**
   * The stage of the job.
   */
  readonly jobStage?: string;
  /**
   * If `mypy` is not already installed, this version will be installed.
   * Installs latest version if `undefined`.
   */
  readonly myPyVersion?: string;
  /**
   * Adds arguments to mypy execution.
   */
  readonly myPyOptions?: string;
  /**
   * Package directory to type check.
   */
  readonly packageDir: string;
}
export interface IMyPy {
  /**
   * If `mypy` is not already installed, this version will be installed.
   * Installs latest version if `undefined`.
   */
  myPyVersion?: string;
  /**
   * Adds arguments to mypy execution.
   */
  myPyOptions?: string;
  /**
   * Package directory to type check.
   */
  packageDir: string;
}

/**
 * Install mypy if not already installed.
 * Execute mypy for `packageDir`.
 *
 * This subclass of `Job` configures the following defaults for the superclass:
 * - name: mypy
 * - stage: lint
 *
 * @returns {Job} - The configured `gcip.Job` instance.
 */
export class MyPy extends Job implements IMyPy {
  myPyVersion?: string;
  myPyOptions?: string;
  packageDir: string;

  constructor(props: MyPyProps) {
    super({
      scripts: [""],
      name: props.jobName ?? "mypy",
      stage: props.jobStage ?? "lint",
    });
    this.myPyVersion = props.myPyVersion;
    this.myPyOptions = props.myPyOptions;
    this.packageDir = props.packageDir;
  }

  render() {
    const myPyVersionIdentifier = this.myPyVersion ?? "";
    this.scripts = [
      `pip3 freeze | grep -q "^mypy" || pip3 install mypy${myPyVersionIdentifier}`,
      `yes | mypy --install-types ${this.packageDir} || true`,
    ];
    if (this.myPyOptions) {
      this.scripts.push(`mypy ${this.myPyOptions} ${this.packageDir}`);
    } else {
      this.scripts.push(`mypy ${this.packageDir}`);
    }

    return super.render();
  }
}

export interface IsortProps {
  /**
   * The name of the job.
   */
  readonly jobName?: string;
  /**
   * The stage of the job.
   */
  readonly jobStage?: string;
}
export interface IIsort {}

/**
 * Runs:
 *
 * ```
 * pip3 install --upgrade isort
 * isort --check .
 * ```
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: isort
 * - stage: lint
 */
export class Isort extends Job implements IIsort {
  constructor(props: IsortProps) {
    super({
      scripts: ["pip3 install --upgrade isort", "isort --check ."],
      name: props.jobName ?? "isort",
      stage: props.jobStage ?? "lint",
    });
  }
}
