import { JobCollection } from "../../../core";
import { Deploy, Diff } from "../jobs";

/**
 * Configuration properties for initializing a DiffDeploy instance.
 */
export interface DiffDeployOpts {
  /**
   * An array of stack names for which to generate a diff and perform deployment.
   */
  stacks: string[];

  /**
   * Optional context values to provide additional information for the diff and deployment.
   */
  context?: Record<string, string>;
}

/**
 * Represents the interface that a DiffDeploy instance adheres to.
 */
export interface IDiffDeploy {
  /**
   * An array of stack names for which to generate a diff and perform deployment.
   */
  stacks: string[];

  /**
   * Optional context values to provide additional information for the diff and deployment.
   */
  context?: Record<string, string>;

  /**
   * The instance of the Diff job associated with this DiffDeploy instance.
   */
  diffJob: Diff;

  /**
   * The instance of the Deploy job associated with this DiffDeploy instance.
   */
  deployJob: Deploy;
}

/**
 * A class that manages the configuration and execution of combined Diff and Deploy operations.
 * Inherits from the base JobCollection class and implements the IDiffDeploy interface.
 */
export class DiffDeploy extends JobCollection implements IDiffDeploy {
  stacks: string[];
  context?: Record<string, string>;
  diffJob: Diff;
  deployJob: Deploy;

  /**
   * Creates an instance of DiffDeploy.
   * @param props - Configuration properties for the DiffDeploy job collection.
   */
  constructor(props: DiffDeployOpts) {
    super();
    this.stacks = props.stacks;
    this.context = props.context;

    /**
     * Create and configure the diff job
     */
    this.diffJob = new Diff({ stacks: this.stacks, context: this.context });

    /**
     * Create and configure the deploy job
     */
    this.deployJob = new Deploy({
      stacks: this.stacks,
      context: this.context,
    });

    // Add a dependency relationship: deployJob needs to run after diffJob
    this.deployJob.addNeeds([this.diffJob]);

    // Add the diffJob and deployJob as children of this DiffDeploy job collection
    this.addChildren({ jobsOrJobCollections: [this.diffJob, this.deployJob] });
  }
}
