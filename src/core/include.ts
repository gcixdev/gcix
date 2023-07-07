import { IBase } from '.';
import { validURL } from '../helper';

/**
 * This module represents the Gitlab CI [Include](https://docs.gitlab.com/ee/ci/yaml/#include) keyword.
 *
 * Use include to include external YAML files in your CI/CD configuration.
 *
 * ----
 *
 * [include:local](https://docs.gitlab.com/ee/ci/yaml/#includelocal) example:
 *
 * ```
 * pipeline.add_include(IncludeLocal("/templates/.gitlab-ci-template.yml"))
 * ```
 *
 * ----
 *
 * [include:file](https://docs.gitlab.com/ee/ci/yaml/#includefile) example:
 *
 * ```
 * pipeline.add_include(IncludeFile(
 *         project="my-group/my-project",
 *         ref="master",
 *         file="/templates/.gitlab-ci-template.yml"
 *     ))
 * ```
 *
 * ----
 *
 * [include:remote](https://docs.gitlab.com/ee/ci/yaml/#includeremote) example:
 *
 * ```
 * pipeline.add_include(IncludeRemote("https://gitlab.com/example-project/-/raw/master/.gitlab-ci.yml"))
 * ```
 *
 * ----
 *
 * [include:template](https://docs.gitlab.com/ee/ci/yaml/#includetemplate) example:
 *
 * ```
 * pipeline.add_include(IncludeTemplate("Auto-DevOps.gitlab-ci.yml"))
 * ```
 *
 * ----
 *
 * Special type of include: Use a `gcip.core.job.TriggerJob` with `IncludeArtifact` to run [a child pipeline with a generated
 * configuration file from a previous job](https://docs.gitlab.com/ee/ci/yaml/README.html#trigger-child-pipeline-with-generated-configuration-file):
 *
 * ```
 * TriggerJob(includes=IncludeArtifact(job="generate-config", artifact="generated-config.yml"))
 * ```
 *
 * Note: The `IncludeArtifact` isn't implemented very well as it currently cannot handle `gcip.core.job.Job` objects. You need to know the jobs final name,
 * which is not very handy. This could be implemented much better in future.
 */

export interface IInclude extends IBase {}

/**
 * This is just an abstract superclass.
 *
 * Please use one of the subclasses:
 *
 * * `IncludeLocal`
 * * `IncludeFile`
 * * `IncludeRemote`
 * * `IncludeTemplate`
 * * `IncludeArtifact`
 */
export class Include implements IInclude {
  rendered: any;
  constructor() {
    this.rendered = undefined;
  }
  render(): any {
    return this.rendered;
  }
  isEqual(comparable: IBase): comparable is Include {
    return this.render() === comparable.render();
  }
}

export interface RenderedIncludeLocal {
  readonly local: string;
}

export interface IncludeLocalProps {
  /**
   * Relative path to the file within this repository to include.
   */
  readonly local: string;
}

export interface IIncludeLocal extends IInclude {}

/**
 * This module represents the Gitlab CI
 * [include:local](https://docs.gitlab.com/ee/ci/yaml/#includelocal) keyword.
 */
export class IncludeLocal extends Include implements IIncludeLocal {
  constructor(props: IncludeLocalProps) {
    super();
    this.rendered = { local: props.local };
  }
}

export interface RenderedIncludeFile {
  readonly file: string;
  readonly project: string;
  readonly ref?: string;
}

export interface IncludeFileProps {
  /**
   * Relative path to the file to include.
   */
  readonly file: string;
  /**
   * Project to include the file from.
   */
  readonly project: string;
  /**
   * Project branch to include the file from.
   */
  readonly ref?: string;
}
export interface IIncludeFile extends IInclude {}

/**
 * This module represents the Gitlab CI
 * [include:file](https://docs.gitlab.com/ee/ci/yaml/#includefile) keyword.
 */
export class IncludeFile extends Include implements IIncludeFile {
  constructor(props: IncludeFileProps) {
    super();
    this.rendered = {
      file: props.file,
      project: props.project,
      ref: props.ref,
    };
  }
}

export interface RenderedIncludeRemote {
  readonly remote: string;
}
export interface IncludeRemoteProps {
  /**
   * URL to include the file from.
   */
  readonly remote: string;
}
export interface IIncludeRemote extends IInclude {}

/**
 * @description This module represents the Gitlab CI
 * [include:remote](https://docs.gitlab.com/ee/ci/yaml/#includeremote) keyword.
 * @throws Error if `remote` is not a valid URL.
 */
export class IncludeRemote extends Include implements IIncludeRemote {
  constructor(props: IncludeRemoteProps) {
    super();
    if (!validURL(props.remote)) {
      throw new Error(`\`remote\` is not a valid URL: ${props.remote}`);
    }
    this.rendered = {
      remote: props.remote,
    };
  }
}

export interface RenderedIncludeTemplate {
  readonly template: string;
}
export interface IncludeTemplateProps {
  /**
   * Gitlab template pipeline to include.
   */
  readonly template: string;
}
export interface IIncludeTemplate extends IInclude {}

/**
 * @description This class represents the Gitlab CI
 * [include:template](https://docs.gitlab.com/ee/ci/yaml/#includetemplate) keyword.
 */
export class IncludeTemplate extends Include implements IIncludeTemplate {
  constructor(props: IncludeTemplateProps) {
    super();
    this.rendered = { template: props.template };
  }
}

export interface RenderedIncludeArtifact {
  readonly job: string;
  readonly artifact: string;
}
export interface IncludeArtifactProps {
  /**
   * Job name to include the artifact from.
   */
  readonly job: string;
  /**
   * Relative path to the artifact which is produced by `job`.
   */
  readonly artifact: string;
}
export interface IIncludeArtifact extends IInclude {}

/**
 * @description A special type of include: Use a `gcip.core.job.TriggerJob`
 * with `IncludeArtifact` to run
 * [a child pipeline with a generated configuration file from a previous job](https://docs.gitlab.com/ee/ci/yaml/README.html#trigger-child-pipeline-with-generated-configuration-file):
 */
export class IncludeArtifact extends Include implements IIncludeArtifact {

  constructor(props: IncludeArtifactProps) {
    super();
    this.rendered = {
      job: props.job,
      artifact: props.artifact,
    };
  }
}
