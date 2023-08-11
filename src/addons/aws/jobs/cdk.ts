import { Job } from "../../../core";

/**
 * Configuration properties for initializing a Bootstrap instance.
 */
export interface BootstrapProps {
  /**
   * The AWS account ID associated with the Bootstrap configuration.
   */
  readonly awsAccountId: string;

  /**
   * The AWS region in which the Bootstrap will be performed.
   */
  readonly awsRegion: string;

  /**
   * The name of the toolkit stack used for Bootstrap.
   */
  readonly toolkitStackName: string;

  /**
   * The qualifier applied to the Bootstrap.
   */
  readonly qualifier: string;

  /**
   * Optional resource tags that can be applied during Bootstrap.
   */
  readonly resourceTags?: { [key: string]: string };

  /**
   * An optional name for the Bootstrap job.
   */
  readonly jobName?: string;

  /**
   * An optional stage for the Bootstrap job.
   */
  readonly jobStage?: string;
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
  readonly stacks: string[];

  /**
   * Optional diff options to customize the diff process.
   */
  readonly diffOptions?: string;

  /**
   * Optional context values to provide additional information for the diff.
   */
  readonly context?: Record<string, string>;

  /**
   * An optional name for the Diff job.
   */
  readonly jobName?: string;

  /**
   * An optional stage for the Diff job.
   */
  readonly jobStage?: string;
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

/**
 * Configuration properties for initializing a Deploy instance.
 */
export interface DeployProps {
  /**
   * An array of stack names to be deployed.
   */
  readonly stacks: string[];

  /**
   * Optional toolkit stack name used for deployment.
   */
  readonly toolkitStackName?: string;

  /**
   * Enable strict deployment mode.
   */
  readonly strict?: boolean;

  /**
   * Wait for stacks to complete deployment.
   */
  readonly waitForStack?: boolean;

  /**
   * AWS assume role for stack waiting.
   */
  readonly waitForStackAssumeRole?: string;

  /**
   * AWS account ID for stack waiting.
   */
  readonly waitForStackAccountId?: string;

  /**
   * Optional deployment options.
   */
  readonly deployOptions?: string;

  /**
   * Optional context values to provide additional information for deployment.
   */
  readonly context?: Record<string, string>;

  /**
   * An optional name for the Deploy job.
   */
  readonly jobName?: string;

  /**
   * An optional stage for the Deploy job.
   */
  readonly jobStage?: string;
}

/**
 * Represents the interface that a Deploy instance adheres to.
 */
export interface IDeploy {
  /**
   * An array of stack names to be deployed.
   */
  stacks: string[];

  /**
   * Optional toolkit stack name used for deployment.
   */
  toolkitStackName?: string;

  /**
   * Flag indicating if strict deployment mode is enabled.
   */
  strict: boolean;

  /**
   * Flag indicating if the deployment should wait for stack completion.
   */
  waitForStack: boolean;

  /**
   * AWS assume role for stack waiting.
   */
  waitForStackAssumeRole?: string;

  /**
   * AWS account ID for stack waiting.
   */
  waitForStackAccountId?: string;

  /**
   * Optional deployment options.
   */
  deployOptions?: string;

  /**
   * Optional context values to provide additional information for deployment.
   */
  context?: Record<string, string>;

  /**
   * An optional name for the Deploy job.
   */
  jobName?: string;

  /**
   * An optional stage for the Deploy job.
   */
  jobStage?: string;
}

/**
 * A class that manages the configuration and rendering of a Deploy job.
 * Inherits from the base Job class and implements the IDeploy interface.
 */
export class Deploy extends Job implements IDeploy {
  stacks: string[];
  toolkitStackName?: string;
  strict: boolean;
  waitForStack: boolean;
  waitForStackAssumeRole?: string;
  waitForStackAccountId?: string;
  context?: Record<string, string>;
  deployOptions?: string;
  jobName: string;
  jobStage: string;

  /**
   * Creates an instance of Deploy.
   * @param props - Configuration properties for the Deploy job.
   */
  constructor(props: DeployProps) {
    const jobName = props.jobName ?? "cdk";
    const jobStage = props.jobStage ?? "deploy";

    super({ scripts: [], name: jobName, stage: jobStage });

    this.stacks = props.stacks;
    this.toolkitStackName = props.toolkitStackName;
    this.strict = props.strict ?? true;
    this.waitForStack = props.waitForStack ?? true;
    this.waitForStackAssumeRole = props.waitForStackAssumeRole;
    this.waitForStackAccountId = props.waitForStackAccountId;
    this.context = props.context;
    this.deployOptions = props.deployOptions;
    this.jobName = jobName;
    this.jobStage = jobStage;
  }

  /**
   * Renders the Deploy job's configuration and scripts.
   * @returns The rendered configuration and scripts.
   */
  render() {
    const script = [];

    if (this.waitForStack) {
      const waitForStackOptions: string[] = [];
      if (!this.waitForStackAssumeRole && this.waitForStackAccountId) {
        console.warn(
          "`waitForStackAccountId` has no effect without `waitForStackAssumeRole`",
        );
      }
      if (this.waitForStackAssumeRole) {
        waitForStackOptions.push(
          `--assume-role ${this.waitForStackAssumeRole}`,
        );
      }
      if (this.waitForStackAccountId) {
        waitForStackOptions.push(
          `--assume-role-account-id ${this.waitForStackAccountId}`,
        );
      }
      const cfnWaiterList = [
        "npx --package @gcix/gcix cfnwaiter",
        `--stack-names '${this.stacks.join(" ")}'`,
      ];

      if (waitForStackOptions.length > 0)
        cfnWaiterList.push(waitForStackOptions.join(" "));

      this.scripts.push(cfnWaiterList.join(" "));
    }

    script.push("cdk deploy --require-approval 'never'");

    if (this.strict) script.push("--strict");

    if (this.deployOptions) script.push(this.deployOptions);

    if (this.context && Object.keys(this.context).length) {
      const formattedContext = Object.entries(this.context).map(
        ([k, v]) => `-c ${k}=${v}`,
      );
      script.push(...formattedContext);
    }

    if (this.toolkitStackName)
      script.push(`--toolkit-stack-name ${this.toolkitStackName}`);

    script.push(this.stacks.join(" "));

    this.scripts.push(script.join(" "));

    return super.render();
  }
}
