import { Job, PredefinedVariables, Rule } from "..";
import { PredefinedImages } from "../container";

export interface MirrorProps {
  /**
   * The git repository the code of the pipelines repository should be
   * mirrored to.
   */
  readonly remoteRepository: string;
  /**
   * The 'user.email' with which the commits to the remote repository should
   * be made. Defaults to GITLAB_USER_EMAIL.
   */
  readonly gitConfigUserEmail?: string;
  /**
   * The 'user.name' with which the commits to the remote repository should
   * be made. Defaults to GITLAB_USER_NAME.
   */
  readonly gitConfigUserName?: string;
  /**
   * DO NOT PROVIDE YOUR PRIVATE SSH KEY HERE!!! This parameter takes the
   * name of the Gitlab environment variable, which contains the private ssh
   * key used to push to the remote repository. This one should be created as
   * protected and masked variable in the 'CI/CD' settings of your project.
   */
  readonly privateKeyVariable?: string;
  /**
   * This list of strings could contain any commands that should be executed
   * between pulling the current repository and pushing it to the remote.
   * This hook is mostly meant to be for git configuration commands,
   * required to push to the remote repository.
   */
  readonly scriptHook?: string[];
  /**
   * When mirroring to a remote Gitlab instance, you don't want to run this
   * mirroring job there again. With this variable the job only runs, when its
   * value matches the CI_REPOSITORY_URL of the current repository.
   */
  readonly runOnlyForRepositoryUrl?: string;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface IMirror {
  /**
   * The git repository the code of the pipelines repository should be
   * mirrored to.
   */
  remoteRepository: string;
  /**
   * The 'user.email' with which the commits to the remote repository should
   * be made. Defaults to GITLAB_USER_EMAIL.
   */
  gitConfigUserEmail: string;
  /**
   * The 'user.name' with which the commits to the remote repository should
   * be made. Defaults to GITLAB_USER_NAME.
   */
  gitConfigUserName: string;
  /**
   * DO NOT PROVIDE YOUR PRIVATE SSH KEY HERE!!! This parameter takes the
   * name of the Gitlab environment variable, which contains the private ssh
   * key used to push to the remote repository. This one should be created as
   * protected and masked variable in the 'CI/CD' settings of your project.
   */
  privateKeyVariable?: string;
  /**
   * This list of strings could contain any commands that should be executed
   * between pulling the current repository and pushing it to the remote.
   * This hook is mostly meant to be for git configuration commands,
   * required to push to the remote repository.
   */
  scriptHook: string[];
  /**
   * When mirroring to a remote Gitlab instance, you don't want to run this
   * mirroring job there again. With this variable the job only runs, when its
   * value matches the CI_REPOSITORY_URL of the current repository.
   */
  runOnlyForRepositoryUrl?: string;
}

/**
 * This job clones the CI_COMMIT_REF_NAME of the current repository and
 * forcefully pushes this REF to the `remote_repository`.
 *
 * This subclass of `Job` will configure following defaults for the superclass:
 *
 * * name: git-mirror
 * * stage: deploy
 * * image: PredefinedImages.ALPINE_GIT
 */
export class Mirror extends Job implements IMirror {
  remoteRepository: string;
  gitConfigUserEmail: string;
  gitConfigUserName: string;
  privateKeyVariable?: string | undefined;
  scriptHook: string[];
  runOnlyForRepositoryUrl?: string | undefined;
  constructor(props: MirrorProps) {
    super({
      scripts: [""],
      name: props.jobName ? props.jobName : "git-mirror",
      stage: props.jobStage ? props.jobStage : "deploy",
      image: PredefinedImages.ALPINE_GIT,
    });
    this.remoteRepository = props.remoteRepository;
    this.gitConfigUserEmail =
      props.gitConfigUserEmail ?? PredefinedVariables.gitlabUserEmail;
    this.gitConfigUserName =
      props.gitConfigUserName ?? PredefinedVariables.gitlabUserName;
    this.privateKeyVariable = props.privateKeyVariable;
    this.scriptHook = props.scriptHook ?? [];
    this.runOnlyForRepositoryUrl = props.runOnlyForRepositoryUrl;
  }

  render() {
    this.scripts = [];
    if (this.privateKeyVariable) {
      this.scripts.push(
        "eval $(ssh-agent -s)",
        `echo "$${this.privateKeyVariable}" | tr -d '\\r' | ssh-add - > /dev/null`,
      );
    }

    this.scripts.push(
      "set -eo pipefail",
      "mkdir /tmp/repoReplicaUniqueDir",
      "cd /tmp/repoReplicaUniqueDir",
      `git clone -b ${PredefinedVariables.ciCommitRefName} ${PredefinedVariables.ciRepositoryUrl} .`,
      `git config --global user.email "${this.gitConfigUserEmail}"`,
      `git config --global user.name "${this.gitConfigUserName}"`,
      ...this.scriptHook,
      `git push --force ${this.remoteRepository} ${PredefinedVariables.ciCommitRefName}:${PredefinedVariables.ciCommitRefName}`,
      `echo "Published code to ${this.remoteRepository}:${PredefinedVariables.ciCommitRefName}"`,
    );

    if (this.runOnlyForRepositoryUrl) {
      this.appendRules([
        new Rule({
          ifStatement: `CI_REPOSITORY_URL="${this.runOnlyForRepositoryUrl}"`,
        }),
      ]);
    }
    return super.render();
  }
}
