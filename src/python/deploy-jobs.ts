import { Job } from "..";

/**
 * Represents the properties for the `TwineUpload` class.
 */
export interface PythonDeployTwineUploadProps {
  /**
   * The name of the job.
   */
  readonly jobName?: string;
  /**
   * The stage of the job.
   */
  readonly jobStage?: string;
  /**
   * The URL to the PyPI repository to which the Python artifacts will be
   * deployed. If `undefined` the package is published to `https://pypi.org`.
   */
  readonly twineRepositoryUrl?: string;
  /**
   * The name of the environment variable containing the username value.
   * **DO NOT PROVIDE THE USERNAME VALUE ITSELF!** This would be a security issue!
   * Defaults to 'TWINE_USERNAME'.
   */
  readonly twineUsernameEnvVar?: string;
  /**
   * The name of the environment variable containing the password.
   * **DO NOT PROVIDE THE LOGIN VALUE ITSELF!** This would be a security issue!
   * Defaults to 'TWINE_PASSWORD'.
   */
  readonly twinePasswordEnvVar?: string;
}

export interface IPythonDeployTwineUpload {
  /**
   * The URL to the PyPI repository to which the Python artifacts will be
   * deployed. If `undefined` the package is published to `https://pypi.org`.
   */
  twineRepositoryUrl?: string;
  /**
   * The name of the environment variable containing the username value.
   * **DO NOT PROVIDE THE USERNAME VALUE ITSELF!** This would be a security issue!
   * Defaults to 'TWINE_USERNAME'.
   */
  twineUsernameEnvVar: string;
  /**
   * The name of the environment variable containing the password.
   * **DO NOT PROVIDE THE LOGIN VALUE ITSELF!** This would be a security issue!
   * Defaults to 'TWINE_PASSWORD'.
   */
  twinePasswordEnvVar: string;
}

/**
 * Runs:
 *
 * ```
 * pip3 install --upgrade twine
 * python3 -m twine upload --non-interactive --disable-progress-bar dist/*
 * ```
 *
 * Requires artifacts from a build job under `dist/` (e.g. from `BdistWheel()`)
 *
 * This subclass of `Job` configures the following defaults for the superclass:
 * - name: twine
 * - stage: deploy
 */
export class PythonDeployTwineUpload
  extends Job
  implements IPythonDeployTwineUpload
{
  twineRepositoryUrl?: string;
  twineUsernameEnvVar: string;
  twinePasswordEnvVar: string;

  constructor(props: PythonDeployTwineUploadProps) {
    super({
      scripts: [""],
      name: props.jobName ?? "twine",
      stage: props.jobStage ?? "deploy",
    });
    this.twineRepositoryUrl = props.twineRepositoryUrl;
    this.twineUsernameEnvVar = props.twineUsernameEnvVar ?? "TWINE_USERNAME";
    this.twinePasswordEnvVar = props.twinePasswordEnvVar ?? "TWINE_PASSWORD";
  }

  render() {
    this.addVariables({
      TWINE_USERNAME: `\$${this.twineUsernameEnvVar}`,
      TWINE_PASSWORD: `\$${this.twinePasswordEnvVar}`,
    });

    if (this.twineRepositoryUrl)
      this.addVariables({ TWINE_REPOSITORY_URL: this.twineRepositoryUrl });

    this.scripts = [
      "pip3 install --upgrade twine",
      "python3 -m twine upload --non-interactive --disable-progress-bar dist/*",
    ];
    return super.render();
  }
}
