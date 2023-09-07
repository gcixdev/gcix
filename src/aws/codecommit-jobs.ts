import { PredefinedVariables } from "..";
import { IGitMirror, GitMirror, GitMirrorProps } from "../git";
import { LinuxScripts } from "../linux";

export interface CdkMirrorToCodecommitProps {
  /**
   * The name of the target Codecommit repository.
   * @default CI_PROJECT_PATH_SLUG.
   */
  readonly repositoryName?: string;
  /**
   * The AWS region you want to operate in. When not set, it would be
   * curl'ed from the current EC2 instance metadata.
   */
  readonly awsRegion?: string;
  /**
   * Only if the ECR would be created on the first call, these AWS Tags
   * becomes applied to the AWS Codecommit resource. Changed values won't
   * change the tags on an already existing ECR. This string must have the
   * pattern: `Tag1=Value1,Tag2=Value2`
   */
  readonly infrastructureTags?: string;
  /**
   * Options for the upstream Mirror job.
   */
  readonly mirrorOpts?: GitMirrorProps;
}

export interface ICdkMirrorToCodecommit extends IGitMirror {
  /**
   * The name of the target Codecommit repository.
   * @default CI_PROJECT_PATH_SLUG.
   */
  repositoryName: string;
  /**
   * The AWS region you want to operate in. When not set, it would be
   * curl'ed from the current EC2 instance metadata.
   */
  awsRegion?: string;
  /**
   * Only if the ECR would be created on the first call, these AWS Tags
   * becomes applied to the AWS Codecommit resource. Changed values won't
   * change the tags on an already existing ECR. This string must have the
   * pattern: `Tag1=Value1,Tag2=Value2`
   */
  infrastructureTags?: string;
}

/**
 * This job clones the CI_COMMIT_REF_NAME of the current repository and forcefully pushes this REF to a AWS CodeCommit repository.
 *
 * This job requires following IAM permissions:
 *
 * - codecommit:CreateRepository
 * - codecommit:GetRepository
 * - codecommit:CreateBranch
 * - codecommit:GitPush
 * - codecommit:TagResource
 *
 * You could also limit the resource to `!Sub arn:aws:codecommit:${AWS::Region}:${AWS::AccountId}:<repository-name>`.
 *
 */
export class CdkMirrorToCodecommit
  extends GitMirror
  implements ICdkMirrorToCodecommit
{
  repositoryName: string;
  awsRegion?: string;
  infrastructureTags?: string;
  mirrorOpts?: GitMirrorProps;

  constructor(props: CdkMirrorToCodecommitProps) {
    if (props.mirrorOpts) {
      super(props.mirrorOpts);
    } else {
      super({ remoteRepository: "${GCIP_REMOTE_REPO_URL}" });
    }

    this.repositoryName =
      props.repositoryName ?? PredefinedVariables.ciProjectPathSlug;
    this.awsRegion = props.awsRegion;
    this.infrastructureTags = props.infrastructureTags;
  }

  render() {
    const infrastructureTagsOption = this.infrastructureTags
      ? `--tags "${this.infrastructureTags}"`
      : "";

    this.scriptHook = [];
    if (this.awsRegion) {
      this.scriptHook.push(`export AWS_DEFAULT_REGION=${this.awsRegion}`);
    } else {
      this.scriptHook.push(
        /* To prevent the error 'curl: (48) An unknown option was passed in to libcurl'
         *  we install also "curl-dev".
         *  https://stackoverflow.com/a/41651363/1768273
         */
        LinuxScripts.installPackages({ packages: ["curl", "curl-dev", "jq"] }),
        "export AWS_DEFAULT_REGION=$(curl --silent " +
          "http://169.254.169.254/latest/dynamic/instance-identity/document | " +
          "jq -r .region)",
      );
    }

    const getRepoURL =
      "GCIP_REMOTE_REPO_URL=$(aws codecommit get-repository" +
      ` --repository-name "${this.repositoryName}" --output text` +
      " --query repositoryMetadata.cloneUrlHttp || aws codecommit" +
      ` create-repository --repository-name "${this.repositoryName}"` +
      ` ${infrastructureTagsOption} --output text --query` +
      " repositoryMetadata.cloneUrlHttp)";
    this.scriptHook.push(
      LinuxScripts.installPackages({ packages: ["aws-cli"] }),
      getRepoURL,
      "git config --local credential.helper '!aws codecommit credential-helper $@'",
      "git config --local credential.UseHttpPath true",
    );

    return super.render();
  }
}
