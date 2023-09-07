import { PythonScripts } from "./scripts";
import { Job, RuleLib } from "../";
import { PredefinedImages } from "../container";

export interface PythonTestPytestProps {
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

export interface IPythonTestPytest {
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
export class PythonTestPytest extends Job implements IPythonTestPytest {
  pytestCommand: string;
  pipenvVersionSpecifier: string;

  constructor(props: PythonTestPytestProps) {
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

export interface PythonTestEvaluateGitTagPep440ConformityProps {
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface IPythonTestEvaluateGitTagPep440Conformity {}

/**
 * Checks if the current pipelines `$CI_COMMIT_TAG` validates to a valid Python
 * package version according to https://www.python.org/dev/peps/pep-0440
 *
 * This job already contains a rule to only run when a `$CI_COMMIT_TAG` is
 * present (`rules.only_tags()`).
 *
 * Runs `pytest` and installs project requirements before
 * `PythonScripts.pipInstallRequirements`
 *
 * - Requires a `requirements.txt` in your project folder containing
 *   at least `pytest`
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: tag-pep440-conformity
 * - stage: test
 * - image: PredefinedImages.GCIP
 * - rules: on_tagsg
 */
export class PythonTestEvaluateGitTagPep440Conformity
  extends Job
  implements IPythonTestEvaluateGitTagPep440Conformity
{
  constructor(props: PythonTestEvaluateGitTagPep440ConformityProps) {
    super({
      scripts: [],
      name: props.jobName ?? "tag-pep440-conformity",
      stage: props.jobStage ?? "test",
      rules: [RuleLib.onTags()],
      image: PredefinedImages.GCIX,
    });
  }

  render() {
    this.scripts.push("npx --package @gcix/gcix gittagpep440conformity");
    return super.render();
  }
}
