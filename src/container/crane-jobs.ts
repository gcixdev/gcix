import * as path from "path";
import { DockerClientConfig, PredefinedImages, Registry } from ".";
import { Job } from "..";
import { PredefinedVariables } from "../";

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

export interface PushProps {
  /**
   * Registry URL to copy container image to.
   */
  readonly dstRegistry: string;

  /**
   * Path where to find the container image tarball.
   * @default PredefinedVariables.ciProjectDir
   */
  readonly tarPath?: string;

  /**
   * Container image name, searched for in `imagePath` and gets `.tar` appended.
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
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries. Defaults to a `DockerClientConfig`
   * with login to the official Docker Hub and expecting credentials given as
   * environment variables `REGISTRY_USER` and `REGISTRY_LOGIN`.
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
export interface IPush {
  /**
   * Registry URL to copy container image to.
   */
  dstRegistry: string;

  /**
   * Path where to find the container image tarball.
   * @default PredefinedVariables.ciProjectDir
   */
  tarPath: string;

  /**
   * Container image name, searched for in `imagePath` and gets `.tar` appended.
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
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries. Defaults to a `DockerClientConfig`
   * with login to the official Docker Hub and expecting credentials given as
   * environment variables `REGISTRY_USER` and `REGISTRY_LOGIN`.
   */
  dockerClientConfig: DockerClientConfig;
}

/**
 * Creates a job to push container image to remote container registry with `crane`.
 *
 * The image to copy must be in a `tarball` format. It gets validated with crane
 * and is pushed to `dst_registry` destination registry.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: crane-push
 * - stage: deploy
 * - image: PredefinedImages.CRANE
 *
 */
export class Push extends Job implements IPush {
  dstRegistry: string;
  tarPath: string;
  imageName: string;
  imageTag: string;
  dockerClientConfig: DockerClientConfig;

  constructor(props: PushProps) {
    super({
      scripts: [],
      name: props.jobName ?? "crane-push",
      stage: props.jobStage ?? "deploy",
      image: PredefinedImages.CRANE,
    });

    this.dstRegistry = props.dstRegistry;
    this.tarPath = props.tarPath ?? PredefinedVariables.ciProjectDir;
    this.imageName = props.imageName ?? PredefinedVariables.ciProjectName;
    this.dockerClientConfig =
      props.dockerClientConfig ??
      new DockerClientConfig().addAuth(Registry.DOCKER);

    if (props.imageTag) {
      this.imageTag = props.imageTag;
    } else if (PredefinedVariables.ciCommitTag) {
      this.imageTag = PredefinedVariables.ciCommitTag;
    } else {
      this.imageTag = PredefinedVariables.ciCommitRefSlug;
    }
  }

  render() {
    const imagePath = this.imageName.replace(/\//g, "_");

    this.scripts.push(...this.dockerClientConfig.shellCommand());

    this.scripts.push(
      `crane validate --tarball ${this.tarPath}/${imagePath}.tar`,
      `crane push ${this.tarPath}/${imagePath}.tar ${this.dstRegistry}/${this.imageName}:${this.imageTag}`,
    );

    if (["main", "master"].includes(this.imageTag)) {
      this.scripts.push(
        `crane push ${this.tarPath}/${imagePath}.tar ${this.dstRegistry}/${this.imageName}:latest`,
      );
    }

    return super.render();
  }
}

export interface PullProps {
  /**
   *  Registry URL to pull container image from.
   */
  readonly srcRegistry: Registry | string;

  /**
   * Container image with namespace to pull from `srcRegistry`.
   * @default PredefinedVariables.ciProjectName
   */
  readonly imageName?: string;

  /**
   * Tag of the image which will be pulled.
   * @default latest
   */
  readonly imageTag?: string;

  /**
   * Path where to save the container image tarball.
   * @default PredefinedVariables.ciProjectDir
   */
  readonly tarPath?: string;

  /**
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries.
   * @default DockerClientConfig with login to the official Docker Hub
   * and expecting credentials given as environment variables
   * `REGISTRY_USER` and `REGISTRY_LOGIN`.
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

export interface IPull {
  /**
   *  Registry URL to pull container image from.
   */
  srcRegistry: Registry | string;

  /**
   * Container image with namespace to pull from `srcRegistry`.
   * @default PredefinedVariables.ciProjectName
   */
  imageName: string;

  /**
   * Tag of the image which will be pulled.
   * @default latest
   */
  imageTag: string;

  /**
   * Path where to save the container image tarball.
   * @default PredefinedVariables.ciProjectDir
   */
  tarPath: string;

  /**
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries.
   * @default DockerClientConfig with login to the official Docker Hub
   * and expecting credentials given as environment variables
   * `REGISTRY_USER` and `REGISTRY_LOGIN`.
   */
  dockerClientConfig: DockerClientConfig;
}

/**
 * Creates a job to pull container image from remote container registry with `crane`.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: crane
 * - stage: pull
 * - image: PredefinedImages.CRANE
 *
 */
export class Pull extends Job implements IPull {
  srcRegistry: Registry | string;
  imageName: string;
  imageTag: string;
  tarPath: string;
  dockerClientConfig: DockerClientConfig;

  constructor(props: PullProps) {
    super({
      scripts: [],
      name: props.jobName ?? "crane",
      stage: props.jobStage ?? "pull",
      image: PredefinedImages.CRANE,
    });
    this.srcRegistry = props.srcRegistry;
    this.imageName = props.imageName ?? PredefinedVariables.ciProjectName;
    this.imageTag = props.imageTag ?? "latest";
    this.tarPath = props.tarPath ?? PredefinedVariables.ciProjectDir;
    this.dockerClientConfig =
      props.dockerClientConfig ??
      new DockerClientConfig().addAuth(Registry.DOCKER);
  }

  render() {
    const imagePath = this.imageName.replace(/\//g, "_");
    this.scripts.push(...this.dockerClientConfig.shellCommand());
    this.scripts.push(
      `mkdir -p ${path.normalize(this.tarPath)}`,
      `crane pull ${this.srcRegistry}/${this.imageName}:${this.imageTag} ${this.tarPath}/${imagePath}.tar`,
    );
    return super.render();
  }
}
