/**
 * This modules provide Jobs executing
 * [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/) scripts
 *
 * Those require [Docker to be installed](https://docs.docker.com/engine/install/)
 * on the Gitlab runner.
 */

import { Job } from "..";

export interface DockerBuildProps {
  /**
   * The Docker repository name `([<registry>/]<image>)`.
   */
  readonly repository: string;
  /**
   * The Docker build context (the directory containing the Dockerfile).
   * @default `.`
   */
  readonly context?: string;
  /**
   * A Docker image tag applied to the image. If not set docker uses `latest`
   */
  readonly tag?: string;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface IDockerBuild {
  /**
   * The Docker repository name `([<registry>/]<image>)`.
   */
  repository: string;
  /**
   * The Docker build context (the directory containing the Dockerfile).
   * @default `.`
   */
  context: string;
  /**
   * A Docker image tag applied to the image.
   * @default "latest"
   */
  tag: string;
}

/**
 * Runs [`docker build`](https://docs.docker.com/engine/reference/commandline/build/)
 *
 * Example:
 *
 * ```
 * import { Build } from "@gcix/gcix"
 * const buildJob = Build({repository: "myrepo/myimage", tag: "v0.1.0"})
 * ```
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: docker
 * - stage: build
 *
 */
export class DockerBuild extends Job implements IDockerBuild {
  repository: string;
  context: string;
  tag: string;

  constructor(props: DockerBuildProps) {
    super({
      scripts: [],
      name: props.jobName ?? "docker",
      stage: props.jobStage ?? "build",
    });
    this.repository = props.repository;
    this.context = props.context ?? ".";
    this.tag = props.tag ?? "latest";

    this.addVariables({ DOCKER_DRIVER: "overlay2", DOCKER_TLS_CERTDIR: "" });
  }

  render() {
    const fqImageName = this.repository + ":" + this.tag;

    this.scripts.push(`docker build -t ${fqImageName} ${this.context}`);
    return super.render();
  }
}

export interface DockerPushProps {
  /**
   * The name of the Docker image to push to the `registry`.
   */
  readonly containerImage: string;
  /**
   * The Docker registry the image should be pushed to.
   * @default index.docker.io/v1
   */
  readonly registry?: string;
  /**
   * The Docker image tag that should be pushed to the `registry`.
   * @default `latest`
   */
  readonly tag?: string;
  /**
   * If you have to login to the registry before the push, you have to provide
   * the name of the environment variable, which contains the username value, here.
   * **DO NOT PROVIDE THE USERNAME VALUE ITSELF!** This would be a security issue!
   */
  readonly userEnvVar?: string;
  /**
   * If you have to login to the registry before the push, you have to provide
   * the name of the environment variable, which contains the password or token, here.
   * **DO NOT PROVIDE THE LOGIN VALUE ITSELF!** This would be a security issue!
   */
  readonly loginEnvVar?: string;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface IDockerPush {
  /**
   * The name of the Docker image to push to the `registry`.
   */
  containerImage: string;
  /**
   * The Docker registry the image should be pushed to.
   * @default index.docker.io/v1
   */
  registry: string;
  /**
   * The Docker image tag that should be pushed to the `registry`.
   * @default `latest`
   */
  tag: string;
  /**
   * If you have to login to the registry before the push, you have to provide
   * the name of the environment variable, which contains the username value, here.
   * **DO NOT PROVIDE THE USERNAME VALUE ITSELF!** This would be a security issue!
   */
  userEnvVar?: string;
  /**
   * If you have to login to the registry before the push, you have to provide
   * the name of the environment variable, which contains the password or token, here.
   * **DO NOT PROVIDE THE LOGIN VALUE ITSELF!** This would be a security issue!
   */
  loginEnvVar?: string;
}

/**
 * Runs [`docker push`](https://docs.docker.com/engine/reference/commandline/push/)
 * and optionally [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) before.
 *
 * Example:
 *
 * ```
 * import { Push } from "@gcix/gcix"
 *
 * const pushJob = new Push({
 *                 registry: "index.docker.io/v1/gcix/gcix",
 *                 image: "gcip",
 *                 tag: "v0.1.0",
 *                 userEnvVar: "DOCKER_USER",
 *                 loginEnvVar: "DOCKER_TOKEN"
 *             })
 * ```
 *
 * The `userEnvVar` and `loginEnvVar` should be created as
 * *protected* and *masked* [custom environment variable configured in the UI](https://git.tech.rz.db.de/help/ci/variables/README#create-a-custom-variable-in-the-ui).
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * - name: docker
 * - stage: deploy
 *
 */
export class DockerPush extends Job implements IDockerPush {
  containerImage: string;
  registry: string;
  tag: string;
  userEnvVar?: string | undefined;
  loginEnvVar?: string | undefined;
  constructor(props: DockerPushProps) {
    super({
      scripts: [],
      name: props.jobName ?? "docker",
      stage: props.jobStage ?? "deploy",
    });
    this.containerImage = props.containerImage;
    this.registry = props.registry ?? "index.docker.io/v1";
    this.tag = props.tag ?? "latest";
    this.userEnvVar = props.userEnvVar;
    this.loginEnvVar = props.loginEnvVar;
  }

  render() {
    if (this.userEnvVar && this.loginEnvVar) {
      this.scripts.push(
        `docker login -u "$${this.userEnvVar}" -p "$${this.loginEnvVar}"`,
      );
    }

    let fqImageName = this.containerImage;
    if (this.registry) {
      fqImageName = `${this.registry}/${fqImageName}`;
    }
    if (this.tag) {
      fqImageName += `:${this.tag}`;
    }

    this.scripts.push(`docker push ${fqImageName}`);
    return super.render();
  }
}
