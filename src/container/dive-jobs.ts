import * as path from "path";
import { PredefinedImages } from "./images";
import { Artifacts, Job, PredefinedVariables } from "..";

/**
 * Checks if a given value is within the specified boundaries (0.0 to 1.0).
 * Throws an error if the value is outside this range.
 *
 * @param number validate - The value to be checked.
 * @returns boolean - Returns true if the value is within the boundaries.
 * @throws Error - Throws an error if the value is not within the specified range.
 */
function _checkValueBoundaries(validate: number): boolean {
  if (validate < 0 || validate > 1) {
    throw new Error("Argument is not between 0.0 and 1.0.");
  }
  return true;
}

export interface DiveScanProps {
  /**
   * Path to the image can be either a remote container registry,
   * as well as a local path to an image.
   *
   * @default PredefinedVariables.ciProjectPath
   */
  readonly imagePath?: string;
  /**
   * Name of the container image to scan, if `source` is `docker-archive`
   * argument gets prefix `.tar`.
   *
   * @default PredefinedVariables.ciProjectName
   */
  readonly imageName?: string;
  /**
   * The tag the image will be tagged with.
   * @default PredefinedVariables.ciCommitRefName
   * @default PredefinedVariables.ciCommitTag
   */
  readonly imageTag?: string;
  /**
   * Highest allowable percentage of bytes wasted
   * (as a ratio between 0-1), otherwise CI validation will fail.
   *
   * @default 0.1
   */
  readonly highestUserWastedPercent?: number;
  /**
   * Highest allowable bytes wasted, otherwise CI validation will fail.
   */
  readonly highestWastedBytes?: number;
  /**
   * Lowest allowable image efficiency (as a ratio between 0-1),
   * otherwise CI validation will fail.
   *
   * @default 0.9
   */
  readonly lowestEfficiency?: number;
  /**
   * Ignore image parsing errors and run the analysis anyway.
   *
   * @default false
   */
  readonly ignoreErrors?: boolean;
  /**
   * The container engine to fetch the image from.
   * Allowed values: docker, podman, docker-archive
   * @default "docker-archive
   */
  readonly source?: "docker" | "podman" | "docker-archive";
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}

export interface IDiveScan {
  /**
   * Path to the image can be either a remote container registry,
   * as well as a local path to an image.
   *
   * @default PredefinedVariables.ciProjectPath
   */
  imagePath: string;
  /**
   * Name of the container image to scan, if `source` is `docker-archive`
   * argument gets prefix `.tar`.
   *
   * @default PredefinedVariables.ciProjectName
   */
  imageName: string;
  /**
   * The tag the image will be tagged with.
   * @default PredefinedVariables.ciCommitRefName
   * @default PredefinedVariables.ciCommitTag
   */
  imageTag: string;
  /**
   * Highest allowable percentage of bytes wasted
   * (as a ratio between 0-1), otherwise CI validation will fail.
   *
   * @default 0.1
   */
  highestUserWastedPercent: number;
  /**
   * Highest allowable bytes wasted, otherwise CI validation will fail.
   */
  highestWastedBytes?: number;
  /**
   * Lowest allowable image efficiency (as a ratio between 0-1),
   * otherwise CI validation will fail.
   *
   * @default 0.9
   */
  lowestEfficiency: number;
  /**
   * Ignore image parsing errors and run the analysis anyway.
   *
   * @default false
   */
  ignoreErrors: boolean;
  /**
   * The container engine to fetch the image from.
   * Allowed values: docker, podman, docker-archive
   * @default docker-archive
   */
  source: "docker" | "podman" | "docker-archive";
}

/**
 * Scan your images with [wagoodman/dive](https://github.com/wagoodman/dive).
 *
 * `dive` will scan your container image layers and will output the efficency
 * of each layer. You can see which layer and which file is consuming the most
 * storage and optimize the layers if possible. It prevents container images
 * and its layers beeing polluted with files like apt or yum cache's.
 * The output produced by `dive` is uploaded as an artifact to the
 * GitLab instance.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: dive
 * - stage: check
 * - image: PredefinedImages.DIVE
 * - artifacts: Path 'dive.txt'
 */
export class DiveScan extends Job implements IDiveScan {
  imagePath: string;
  imageName: string;
  imageTag: string;
  highestUserWastedPercent: number;
  highestWastedBytes?: number;
  lowestEfficiency: number;
  ignoreErrors: boolean;
  source: "docker" | "podman" | "docker-archive";
  constructor(props: DiveScanProps) {
    super({
      scripts: [],
      name: props.jobName ?? "dive",
      stage: props.jobStage ?? "check",
      image: PredefinedImages.DIVE,
      artifacts: new Artifacts({ paths: ["dive.txt"] }),
    });
    this.imagePath = props.imagePath ?? PredefinedVariables.ciProjectPath;
    this.imageName = props.imageName ?? PredefinedVariables.ciProjectName;
    this.highestUserWastedPercent = props.highestUserWastedPercent ?? 0.1;
    this.highestWastedBytes = props.highestWastedBytes;
    this.lowestEfficiency = props.lowestEfficiency ?? 0.9;
    this.ignoreErrors = props.ignoreErrors ?? false;
    this.source = props.source ?? "docker-archive";

    if (props.imageTag) {
      this.imageTag = props.imageTag;
    } else if (PredefinedVariables.ciCommitTag) {
      this.imageTag = PredefinedVariables.ciCommitTag;
    } else {
      this.imageTag = PredefinedVariables.ciCommitRefSlug;
    }
  }

  render() {
    if (this.imagePath.endsWith("/")) {
      this.imagePath = this.imagePath.slice(0, -1);
    }
    let imagePath = "";
    if (this.source === "docker-archive") {
      imagePath =
        path.join(
          this.imagePath,
          this.imageName.replace(/\//g, "_"),
          this.imageTag,
        ) + ".tar";
    } else {
      imagePath = this.imageName;
    }

    const diverCommand = ["dive", `${this.source}://${imagePath}`, "--ci"];

    if (_checkValueBoundaries(this.highestUserWastedPercent)) {
      diverCommand.push(
        `--highestUserWastedPercent "${this.highestUserWastedPercent}"`,
      );
    }
    if (
      this.highestWastedBytes &&
      _checkValueBoundaries(this.highestWastedBytes)
    ) {
      diverCommand.push(`--highestWastedBytes "${this.highestWastedBytes}"`);
    }
    if (_checkValueBoundaries(this.lowestEfficiency)) {
      diverCommand.push(`--lowestEfficiency "${this.lowestEfficiency}"`);
    }
    if (this.ignoreErrors) {
      diverCommand.push("--ignore-errors");
    }
    diverCommand.push(`|tee ${PredefinedVariables.ciProjectDir}/dive.txt`);

    this.scripts.push("set -eo pipefail", diverCommand.join(" "));

    return super.render();
  }
}
