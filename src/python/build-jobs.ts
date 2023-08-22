import { PipInstallRequirementsProps, PythonScripts } from "./scripts";
import { Artifacts } from "..";
import { Job } from "../job";
import { LinuxScripts } from "../linux";

export interface BdistWheelProps {
  readonly jobName?: string;
  readonly jobStage?: string;
  readonly pipRequirements?: PipInstallRequirementsProps;
}

export interface IBdistWheel {
  readonly pipenvVersionSpecifier?: string;
  readonly requirementsFile?: string;
}

/**
 * Runs `python3 setup.py bdist_wheel` and installs project requirements
 * Requirements are installed by `LinuxScripts.pipInstallRequirements()`.
 *
 * This subclass of `Job` configures the following defaults for the superclass:
 * - name: bdist_wheel
 * - stage: build
 * - artifacts: Path 'dist/'
 *
 * Requires a `Pipfile.lock` or `requirements.txt` in your project folder
 * containing at least `setuptools`. Creates artifacts under the path 'dist/'.
 *
 * @param pipenvVersionSpecifier - The version hint of pipenv to install if
 * `Pipfile.lock` is found. For example '==2022.08.15'.
 * @default to an empty string, indicating
 * installation of the latest version.
 */
export class BdistWheel extends Job implements IBdistWheel {
  public readonly pipenvVersionSpecifier?: string;
  public readonly requirementsFile?: string;

  constructor(props: BdistWheelProps) {
    super({
      scripts: [""],
      name: props.jobName ?? "bdist_wheel",
      stage: props.jobStage ?? "build",
      artifacts: new Artifacts({ paths: ["dist/"] }),
    });
    this.pipenvVersionSpecifier = props.pipRequirements?.pipenvVersionSpecifier;
    this.requirementsFile = props.pipRequirements?.requirementsFile;
  }

  render() {
    this.scripts = [
      PythonScripts.pipInstallRequirements({
        pipenvVersionSpecifier: this.pipenvVersionSpecifier,
        requirementsFile: this.requirementsFile,
      }),
      "pip list | grep setuptools-git-versioning && " +
        LinuxScripts.installPackages({ packages: ["git"] }),
      "python3 setup.py bdist_wheel",
    ];
    return super.render();
  }
}
