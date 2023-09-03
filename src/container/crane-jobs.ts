import { DockerClientConfig, PredefinedImages } from ".";
import { Job } from "..";

export interface CopyProps {
  /**
   * Registry URL to copy container image from.
   */
  readonly srcRegistry: string;

  /**
   * Registry URL to copy container image to.
   */
  readonly dstRegistry: string;

  /**
   * Creates the Docker configuration file base on objects settings,
   * used by crane to authenticate against given registries.
   */
  readonly dockerClientConfig?: DockerClientConfig;

  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;

  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface ICopy {
  /**
   * Registry URL to copy container image from.
   */
  srcRegistry: string;

  /**
   * Registry URL to copy container image to.
   */
  dstRegistry: string;

  /**
   * Creates the Docker configuration file base on objects settings,
   * used by crane to authenticate against given registries.
   */
  dockerClientConfig?: DockerClientConfig;
}

/**
 * Creates a job to copy container images with `crane`.
 * See [`crane`](https://github.com/google/go-containerregistry/tree/main/cmd/crane)
 *
 * Copying an image is useful, if you want to have container images as close
 * as possible to your cluster or servers.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: crane-copy
 * - stage: deploy
 * - image: PredefinedImages.CRANE
 *
 */
export class Copy extends Job implements ICopy {
  srcRegistry: string;
  dstRegistry: string;
  dockerClientConfig?: DockerClientConfig;
  constructor(props: CopyProps) {
    super({
      scripts: [],
      name: props.jobName ?? "crane-copy",
      stage: props.jobStage ?? "deploy",
      image: PredefinedImages.CRANE,
    });
    this.srcRegistry = props.srcRegistry;
    this.dstRegistry = props.dstRegistry;
    this.dockerClientConfig = props.dockerClientConfig;
  }

  render() {
    if (this.dockerClientConfig) {
      this.scripts.push(...this.dockerClientConfig.shellCommand());
    }
    this.scripts.push(
      `crane validate --remote ${this.srcRegistry}`,
      `crane copy ${this.srcRegistry} ${this.dstRegistry}`,
    );
    return super.render();
  }
}
