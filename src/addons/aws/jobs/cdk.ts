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

/**
 * Configuration properties for initializing a Diff instance.
 */
export interface DiffProps {
  /**
   * An array of stack names for which to generate a diff.
   */
  stacks: string[];

  /**
   * Optional diff options to customize the diff process.
   */
  diffOptions?: string;

  /**
   * Optional context values to provide additional information for the diff.
   */
  context?: Record<string, string>;

  /**
   * An optional name for the Diff job.
   */
  jobName?: string;

  /**
   * An optional stage for the Diff job.
   */
  jobStage?: string;
}

/**
 * Represents the interface that a Diff instance adheres to.
 */
export interface IDiff {
  /**
   * An array of stack names for which to generate a diff.
   */
  stacks: string[];

  /**
   * Optional diff options to customize the diff process.
   */
  diffOptions?: string;

  /**
   * Optional context values to provide additional information for the diff.
   */
  context?: Record<string, string>;

  /**
   * An optional name for the Diff job.
   */
  jobName?: string;

  /**
   * An optional stage for the Diff job.
   */
  jobStage?: string;
}

/**
 * A class that manages the configuration and rendering of a Diff job.
 * Inherits from the base Job class and implements the IDiff interface.
 */
export class Diff extends Job implements IDiff {
  stacks: string[];
  diffOptions?: string;
  context?: Record<string, string>;
  jobName?: string;
  jobStage?: string;

  /**
   * Creates an instance of Diff.
   * @param props - Configuration properties for the Diff job.
   */
  constructor(props: DiffProps) {
    super({
      scripts: [],
      name: props.jobName ?? "cdk",
      stage: props.jobStage ?? "diff",
    });
    this.stacks = props.stacks;
    this.diffOptions = props.diffOptions;
    this.context = props.context;
    this.scripts = [];
  }

  render() {
    const script = ["cdk diff"];

    if (this.diffOptions) script.push(this.diffOptions);
    if (this.context && Object.keys(this.context).length) {
      const formattedContext = Object.entries(this.context).map(
        ([k, v]) => `-c ${k}=${v}`,
      );
      script.push(...formattedContext);
    }
    script.push(this.stacks.join(" "));
    this.scripts.push(script.join(" "));
    return super.render();
  }
}
