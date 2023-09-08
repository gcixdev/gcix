import * as path from "path";
import { PredefinedImages } from ".";
import { Artifacts, Job, PredefinedVariables } from "../";

export interface TrivyScanLocalImageProps {
  /**
   * Path where to find the container image.
   * @default PredefinedVariables.CI_PROJECT_DIR
   */
  readonly imagePath?: string;
  /**
   * Container image name, searched for in `imagePath` and gets `.tar` appended.
   * @default PredefinedVariables.CI_PROJECT_NAME
   */
  readonly imageName?: string;
  /**
   * Scan output format, possible values (table, json).
   * @default "table"
   */
  readonly outputFormat?: "table" | "json";
  /**
   * Severities of vulnerabilities to be displayed (comma separated).
   * @default "UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL"
   */
  readonly severity?: string;
  /**
   * If trivy should run in debug mode.
   * @default false
   */
  readonly debug?: boolean;
  /**
   * List of vulnerability types (comma separated).
   * @default "os,library"
   */
  readonly vulnerabilityTypes?: string;
  /**
   * Exit code when vulnerabilities were found. If true exit code is 1 else 0.
   * @default true
   */
  readonly exitIfVulnerable?: Boolean;
  /**
   * Additional options to pass to `trivy` binary.
   */
  readonly trivyConfig?: string;

  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface ITrivyScanLocalImage {
  /**
   * Path where to find the container image.
   * @default PredefinedVariables.CI_PROJECT_DIR
   */
  imagePath: string;
  /**
   * Container image name, searched for in `imagePath` and gets `.tar` appended.
   * @default PredefinedVariables.CI_PROJECT_NAME
   */
  imageName: string;
  /**
   * Scan output format, possible values (table, json).
   * @default "table"
   */
  outputFormat: "table" | "json";
  /**
   * Severities of vulnerabilities to be displayed (comma separated).
   * @default "UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL"
   */
  severity: string;
  /**
   * If trivy should run in debug mode.
   * @default false
   */
  debug: boolean;
  /**
   * List of vulnerability types (comma separated).
   * @default "os,library"
   */
  vulnerabilityTypes: string;
  /**
   * Exit code when vulnerabilities were found. If true exit code is 1 else 0.
   * @default true
   */
  exitIfVulnerable: Boolean;
  /**
   * Additional options to pass to `trivy` binary.
   */
  trivyConfig?: string;
}
/**
 * This job scanns container images to find vulnerabilities.
 *
 * This job fails with exit code 1 if severities are found.
 * The scan output is printed to stdout and uploaded to the artifacts of GitLab.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: trivy
 * - stage: check
 * - image: PredefinedImages.TRIVY
 * - artifacts: Path 'trivy.txt'
 */
export class TrivyScanLocalImage extends Job implements ITrivyScanLocalImage {
  imagePath: string;
  imageName: string;
  outputFormat: "table" | "json";
  severity: string;
  debug: boolean;
  vulnerabilityTypes: string;
  exitIfVulnerable: Boolean;
  trivyConfig?: string;
  constructor(props: TrivyScanLocalImageProps) {
    super({
      scripts: [],
      name: props.jobName ?? "trivy",
      stage: props.jobStage ?? "check",
      image: PredefinedImages.TRIVY,
      artifacts: new Artifacts({ paths: ["trivy.txt"] }),
    });
    this.imagePath = props.imagePath ?? PredefinedVariables.ciProjectDir;
    this.imageName = (
      props.imageName ?? PredefinedVariables.ciProjectName
    ).replace(/\//g, "_");
    this.outputFormat = props.outputFormat ?? "table";
    this.severity = props.severity ?? "UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL";
    this.debug = props.debug ?? false;
    this.vulnerabilityTypes = props.vulnerabilityTypes ?? "os,library";
    this.exitIfVulnerable = props.exitIfVulnerable ?? false;
    this.trivyConfig = props.trivyConfig;
  }

  render() {
    const trivyCmd = [
      "trivy image",
      `--input ${this.imagePath}/${this.imageName}.tar`,
      "--no-progress",
      `--format ${this.outputFormat}`,
      `--severity ${this.severity}`,
      `--vuln-type ${this.vulnerabilityTypes}`,
    ];
    if (this.exitIfVulnerable) trivyCmd.push("--exit-code 1");
    if (this.debug) trivyCmd.push("--debug");
    if (this.trivyConfig) trivyCmd.push(this.trivyConfig);

    trivyCmd.push(
      "|tee " + path.join(PredefinedVariables.ciProjectDir, "trivy.txt"),
    );

    this.scripts.push(
      "set -eo pipefail",
      trivyCmd.join(" "),
      "trivy --version",
    );

    return super.render();
  }
}

export interface TrivyIgnoreFileCheckProps {
  /**
   * Path to the `.trivyignore` file.
   * @default PredefinedVariables.ciProjectDir/.trivyignore
   */
  readonly trivyignorePath?: string;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface ITrivyIgnoreFileCheck {
  /**
   * Path to the `.trivyignore` file.
   * @default PredefinedVariables.ciProjectDir/.trivyignore
   */
  trivyignorePath: string;
}

/**
 * This job checks if a .trivyignore file exists and is not empty and fails if so.
 *
 * If a .trivyignore file is found and not empty, by default the job fails with `exit 1`,
 * the job is configured to allow failures so that the pipeline keeps running.
 * This ensures the visibility of acknowledged CVE's in the .trivyignore
 * file inside the pipeline.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: trivyignore
 * - stage: check
 * - image: PredefinedImages.BUSYBOX
 * - allow_failure: 1
 */
export class TrivyIgnoreFileCheck extends Job implements ITrivyIgnoreFileCheck {
  trivyignorePath: string;
  constructor(props: TrivyIgnoreFileCheckProps) {
    super({
      scripts: [],
      name: props.jobName ?? "trivyignore",
      stage: props.jobStage ?? "check",
      image: PredefinedImages.BUSYBOX,
      allowFailure: [1],
    });
    this.trivyignorePath = PredefinedVariables.ciProjectDir + "/.trivyignore";
  }

  render() {
    this.scripts.push(
      "set -eo pipefail",
      `test -f ${this.trivyignorePath} || { echo "${this.trivyignorePath} does not exists."; exit 0; }`,
      // The grep-regex (-E) will check for everything but (-v) empty lines ('^ *$') and comments (first character is '#')
      `grep -vE '^ *(#.*)?$' ${this.trivyignorePath} || { echo '${this.trivyignorePath} found but empty.'; exit 0; }`,
      `echo "${this.trivyignorePath} not empty. Please check your vulnerabilities!"; exit 1;`,
    );
    return super.render();
  }
}
