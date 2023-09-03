import { PythonScripts } from "./scripts";
import { Job } from "../";

export interface PytestProps {
  /**
   * This argument is only required if you have a custom command
   * to call pytest.
   */
  readonly pytestCommand?: string;
  /**
   * The version hint of pipenv to install if `Pipfile.lock` is found.
   * For example '==2022.08.15'. Defaults to latest package version.
   */
  readonly pipenvVersionSpecifier?: string;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}

export interface IPytest {
  /**
   * This argument is only required if you have a custom command
   * to call pytest.
   */
  pytestCommand: string;
  /**
   * The version hint of pipenv to install if `Pipfile.lock` is found.
   * For example '==2022.08.15'. Defaults to latest package version.
   */
  pipenvVersionSpecifier: string;
}

/**
 * Runs `pytest` and installs project requirements before
 * `PythonScripts.pipInstallRequirements`
 *
 * - Requires a `Pipfile.lock` or `requirements.txt` in your project folder
 *   containing at least `pytest`
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: pytest
 * - stage: test
 */
export class Pytest extends Job implements IPytest {
  pytestCommand: string;
  pipenvVersionSpecifier: string;

  constructor(props: PytestProps) {
    super({
      scripts: [],
      name: props.jobName ?? "pytest",
      stage: props.jobStage ?? "test",
    });

    this.pytestCommand = props.pytestCommand ?? "pytest";
    this.pipenvVersionSpecifier = props.pipenvVersionSpecifier ?? "";
  }

  render() {
    this.scripts.push(
      PythonScripts.pipInstallRequirements({
        pipenvVersionSpecifier: this.pipenvVersionSpecifier,
      }),
      this.pytestCommand,
    );
    return super.render();
  }
}
