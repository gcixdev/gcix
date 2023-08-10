import { Job } from "../../../core";

/**
 * Configuration properties for initializing a Bootstrap instance.
 */
export interface BootstrapProps {
  /**
   * The AWS account ID associated with the Bootstrap configuration.
   */
  awsAccountId: string;

  /**
   * The AWS region in which the Bootstrap will be performed.
   */
  awsRegion: string;

  /**
   * The name of the toolkit stack used for Bootstrap.
   */
  toolkitStackName: string;

  /**
   * The qualifier applied to the Bootstrap.
   */
  qualifier: string;

  /**
   * Optional resource tags that can be applied during Bootstrap.
   */
  resourceTags?: { [key: string]: string };

  /**
   * An optional name for the Bootstrap job.
   */
  jobName?: string;

  /**
   * An optional stage for the Bootstrap job.
   */
  jobStage?: string;
}

/**
 * Represents the interface that a Bootstrap instance adheres to.
 */
export interface IBootstrap {
  /**
   * The AWS account ID associated with the Bootstrap configuration.
   */
  awsAccountId: string;

  /**
   * The AWS region in which the Bootstrap will be performed.
   */
  awsRegion: string;

  /**
   * The name of the toolkit stack used for Bootstrap.
   */
  toolkitStackName: string;

  /**
   * The qualifier applied to the Bootstrap.
   */
  qualifier: string;

  /**
   * Optional resource tags that can be applied during Bootstrap.
   */
  resourceTags?: { [key: string]: string };

  /**
   * The name of the Bootstrap job.
   */
  jobName: string;

  /**
   * The stage of the Bootstrap job.
   */
  jobStage: string;
}

/**
 * Creates an instance of Bootstrap.
 * @param props - Configuration properties for the Bootstrap job.
 */
export class Bootstrap extends Job implements IBootstrap {
  awsAccountId: string;
  awsRegion: string;
  toolkitStackName: string;
  qualifier: string;
  resourceTags?: { [key: string]: string } | undefined;
  jobName: string;
  jobStage: string;

  constructor(props: BootstrapProps) {
    const jobName = props.jobName ? props.jobName : "toolkit-stack";
    const jobStage = props.jobStage ? props.jobStage : "deploy";

    super({ scripts: [], name: jobName, stage: jobStage });

    this.awsAccountId = props.awsAccountId;
    this.awsRegion = props.awsRegion;
    this.toolkitStackName = props.toolkitStackName;
    this.qualifier = props.qualifier;
    this.resourceTags = props.resourceTags;
    this.jobName = jobName;
    this.jobStage = jobStage;

    this.addVariables({ CDK_NEW_BOOTSTRAP: "1" });
  }

  render() {
    const scripts = [
      "cdk bootstrap",
      `--toolkit-stack-name ${this.toolkitStackName}`,
      `--qualifier ${this.qualifier}`,
      `aws://${this.awsAccountId}/${this.awsRegion}`,
    ];

    if (this.resourceTags) {
      const formattedTags = Object.entries(this.resourceTags).map(
        ([k, v]) => `-t ${k}=${v}`,
      );
      scripts.push(...formattedTags);
    }
    this.scripts.push(scripts.join(" "));
    return super.render();
  }
}
