import * as path from "path";
import { DockerClientConfig, PredefinedImages, Registry } from "./";
import { Job, PredefinedVariables } from "../";

export interface KanikoExecuteProps {
  /**
   * Context which will be send to kaniko. Defaults to `None` which implies
   * the local directory is the context.
   */
  readonly context?: string;
  /**
   * Image name which will be created.
   * @default PredefinedVariables.CI_PROJECT_NAME.
   */
  readonly imageName?: string;
  /**
   * The tag the image will be tagged with.
   * @default PredefinedVariables.CI_COMMIT_REF_NAME
   * @default PredefinedVariables.CI_COMMIT_TAG
   */
  readonly imageTag?: string;
  /**
   * List of container registries to push created image to.
   */
  readonly registries?: Registry[] | string[];
  /**
   * Container images created by kaniko are tarball files.
   * This is the path where to store the image, will be named with suffix `.tar`.
   * This path will be created if not present.
   */
  readonly tarPath?: string;
  /**
   * Container build arguments, used to instrument the container image build.
   */
  readonly buildArgs?: Record<string, any>;
  /**
   * For container multistage builds name of the build stage you want to create.
   * Image tag will be appended with the build_target. e.g. latest-buildtarget.
   */
  readonly buildTarget?: string;
  /**
   * Name of the dockerfile to use. File is relative to context.
   * @default "Dockerfile"
   */
  readonly dockerfile?: string;
  /**
   * Enable push to container registry, disabled to allow subsequent jobs to
   * @default false
   * act on container tarball.
   */
  readonly enablePush?: boolean;
  /**
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries. Defaults to a `DockerClientConfig`
   * with login to the official Docker Hub and expecting credentials given as
   * environment variables `REGISTRY_USER` and `REGISTRY_LOGIN`.
   */
  readonly dockerClientConfig?: DockerClientConfig;
  /**
   * Verbosity of kaniko logging.
   * @default "info"
   */
  readonly verbosity?: string;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface IKanikoExecute {
  /**
   * Context which will be send to kaniko.
   * @default PredefinedVariables.CI_PROJECT_DIR
   */
  context: string;
  /**
   * Image name which will be created.
   * @default PredefinedVariables.CI_PROJECT_NAME.
   */
  imageName: string;
  /**
   * The tag the image will be tagged with.
   * @default PredefinedVariables.CI_COMMIT_REF_NAME
   * @default PredefinedVariables.CI_COMMIT_TAG
   */
  imageTag: string;
  /**
   * List of container registries to push created image to.
   */
  registries?: Registry[] | string[];
  /**
   * Container images created by kaniko are tarball files.
   * This is the path where to store the image, will be named with suffix `.tar`.
   * This path will be created if not present.
   */
  tarPath?: string;
  /**
   * Container build arguments, used to instrument the container image build.
   */
  buildArgs?: Record<string, any>;
  /**
   * For container multistage builds name of the build stage you want to create.
   * Image tag will be appended with the build_target. e.g. latest-buildtarget.
   */
  buildTarget?: string;
  /**
   * Name of the dockerfile to use. File is relative to context.
   * @default "Dockerfile"
   */
  dockerfile: string;
  /**
   * Enable push to container registry, disabled to allow subsequent jobs to
   * act on container tarball.
   * @default false
   */
  enablePush: boolean;
  /**
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries. Defaults to a `DockerClientConfig`
   * with login to the official Docker Hub and expecting credentials given as
   * environment variables `REGISTRY_USER` and `REGISTRY_LOGIN`.
   */
  dockerClientConfig: DockerClientConfig;
  /**
   * Verbosity of kaniko logging.
   * @default "info"
   */
  verbosity: string;
}
/**
 * Creates a job which builds container images.
 *
 * This job creates images depending on git branches.
 * e.g If the branch which gets pushed to the remote is named
 * `my_awsome_feature` the image will be tagged with `my-awsome-feature`.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: kaniko
 * - stage: build
 * - image: PredefinedImages.KANIKO
 */
export class KanikoExecute extends Job implements IKanikoExecute {
  context: string;
  imageName: string;
  imageTag: string;
  registries?: Registry[] | string[];
  tarPath?: string;
  buildArgs?: Record<string, any>;
  buildTarget?: string;
  dockerfile: string;
  enablePush: boolean;
  dockerClientConfig: DockerClientConfig;
  verbosity: string;
  constructor(props: KanikoExecuteProps) {
    super({
      scripts: [],
      name: props.jobName ?? "kaniko",
      stage: props.jobStage ?? "build",
      image: PredefinedImages.KANIKO,
    });

    this.context = path.normalize(
      props.context ?? PredefinedVariables.ciProjectDir,
    );
    this.imageName = props.imageName ?? PredefinedVariables.ciProjectName;
    this.registries = props.registries;
    this.tarPath = props.tarPath ? path.normalize(props.tarPath) : undefined;
    this.buildArgs = props.buildArgs;
    this.buildTarget = props.buildTarget;
    this.dockerfile =
      props.dockerfile ?? `${PredefinedVariables.ciProjectDir}/Dockerfile`;
    this.enablePush = props.enablePush ?? false;
    this.dockerClientConfig =
      props.dockerClientConfig ??
      new DockerClientConfig().addAuth(Registry.DOCKER);
    this.verbosity = props.verbosity ?? "info";

    if (props.imageTag) {
      this.imageTag = props.imageTag;
    } else {
      if (PredefinedVariables.ciCommitTag) {
        this.imageTag = PredefinedVariables.ciCommitTag;
      } else {
        this.imageTag = PredefinedVariables.ciCommitRefSlug;
      }
    }
  }
  render() {
    // Set static config path. Kaniko uses /kaniko/.docker/config.json path
    this.dockerClientConfig.configFilePath = "/kaniko/.docker/config.json";
    this.scripts.push(...this.dockerClientConfig.shellCommand());

    const executorCmd = [
      "executor",
      `--context ${this.context}`,
      `--dockerfile ${this.dockerfile}`,
      `--verbosity ${this.verbosity}`,
    ];

    if (this.tarPath) {
      this.scripts.push(`mkdir -p ${this.tarPath}`);
      executorCmd.push(
        `--tarPath ${path.join(
          this.tarPath,
          this.imageName.replace(/\//g, "_"),
        )}.tar`,
      );
    }

    // Disable push to registries.
    if (!this.enablePush) {
      executorCmd.push("--no-push");
    }

    // Check if multistage build is wanted.
    // Add --target flag to executor and prefix build_target "-"
    let buildTargetPostfix = "";
    if (this.buildTarget) {
      executorCmd.push(`--target ${this.buildTarget}`);
      buildTargetPostfix = `-${this.buildTarget}`;
    }

    // Compose build arguments.
    if (this.buildArgs) {
      Object.entries(this.buildArgs).forEach(([k, v]) => {
        executorCmd.push(`--build-arg "${k}=${v}"`);
      });
    }

    // Extend executor command with --destination per registry
    if (this.registries && this.registries.length > 0) {
      for (const registry of this.registries) {
        executorCmd.push(
          `--destination ${registry}/${this.imageName}:${this.imageTag}${buildTargetPostfix}`,
        );
        if (["main", "master"].includes(this.imageTag)) {
          executorCmd.push(
            `--destination ${registry}/${this.imageName}:latest${buildTargetPostfix}`,
          );
        }
      }
    } else {
      executorCmd.push(
        `--destination ${this.imageName}:${this.imageTag}${buildTargetPostfix}`,
      );
      if (["main", "master"].includes(this.imageTag)) {
        executorCmd.push(
          `--destination ${this.imageName}:latest${buildTargetPostfix}`,
        );
      }
    }

    this.scripts.push(executorCmd.join(" "));

    return super.render();
  }
}
