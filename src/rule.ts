import { Variables } from ".";
import { IBase } from "./base";
import { deepcopy } from "./helper";
/**
 * This module represents the Gitlab CI [rules](https://docs.gitlab.com/ee/ci/yaml/#rules) keyword.
 *
 * Use rules to include or exclude jobs in pipelines.
 *
 * ```
 * myJob.prependRules(
 *     new Rule({
 *         ifStatement='$CI_COMMIT_BRANCH == "master"',
 *         changes: ["Dockerfile", "gcix/**"],
 *         exists: ["Dockerfile"],
 *         when=WhenStatement.ON_FAILURE,
 *         allowFailure: True,
 *         variables: { "SOME_VARIABLE": "foobar" },
 *         })
 *     )
 * ```
 */

/**
 * @internal
 */
export interface RenderedRule {
  readonly if?: string;
  readonly changes?: string[];
  readonly exists?: string[];
  readonly variables?: { [key: string]: string };
  readonly when?: WhenStatement;
  readonly allow_failure?: boolean;
}

/**
 * This enum holds different [when](https://docs.gitlab.com/ee/ci/yaml/#when)
 * statements for `Rule`s.
 */
export enum WhenStatement {
  ALWAYS = "always",
  DELAYED = "delayed",
  MANUAL = "manual",
  NEVER = "never",
  ONFAILURE = "on_failure",
  ONSUCCESS = "on_success",
}

export interface RuleProps {
  /**
   * @description The [rules:if clause](https://docs.gitlab.com/ee/ci/yaml/#when)
   * which decides when a job to the pipeline.
   */
  readonly ifStatement?: string;
  /**
   * @description The [when](https://docs.gitlab.com/ee/ci/yaml/#when)
   * attribute which decides when to run a job.
   * @default WhenStatement.ON_SUCCESS.
   */
  readonly when?: WhenStatement;
  /**
   * @description The [allow_failure](https://docs.gitlab.com/ee/ci/yaml/#allow_failure)
   * attribute which let a job fail without impacting the rest of the CI suite.
   * @default false
   */
  readonly allowFailure?: boolean;
  /**
   * @description The [changes](https://docs.gitlab.com/ee/ci/yaml/#ruleschanges)
   * attribute which adds a job to the pipeline by checking for changes on specific files
   */
  readonly changes?: string[];
  /**
   * @description The [exists](https://docs.gitlab.com/ee/ci/yaml/#rulesexists)
   * attribute which allows to run a job when a certain files exist in the repository
   */
  readonly exists?: string[];
  /**
   * @description The [variables](https://docs.gitlab.com/ee/ci/yaml/#rulesvariables)
   * attribute allows defining or overwriting variables when the conditions are met
   */
  readonly variables?: { [key: string]: string };
}

export interface IRule extends IBase {
  /**
   *
   * Adds one or more [variables](https://docs.gitlab.com/ee/ci/yaml/README.html#variables),
   * each as keyword argument, to the rule.
   *
   * ```
   * rule.addVariables({GREETING: "hello", LANGUAGE: "typescript"})
   * ```
   *
   * @param variables Each variable would be provided as keyword argument:
   * @returns `Rule`: The modified `Rule` object.
   */
  addVariables(variables: Variables): Rule;
  /**
   * This method is intended to be used for predefined rules. For instance you have defined an
   * often used rule `on_master` whose if statement checks if the pipeline is executed on branch
   * `master`. Then you can either run a job, if on master...
   *
   * ```
   * myJob.appendRules(onMaster)
   * ```
   *
   * ... or do not run a job if on master...
   *
   * ```
   * myJob.appendRules(onMaster.never())
   * ```
   * @returns A copy of this rule with the `when` attribute set to `WhenStatement.NEVER`
   *
   */
  never(): Rule;
}

export class Rule implements IRule {
  ifStatement?: string | undefined;
  allowFailure?: boolean | undefined;
  changes?: string[] | undefined;
  exists?: string[] | undefined;
  variables: { [key: string]: string };
  when?: WhenStatement | undefined;

  constructor(props: RuleProps) {
    this.ifStatement = props.ifStatement;
    this.allowFailure = props.allowFailure ?? false;
    this.changes = props.changes;
    this.exists = props.exists;
    this.variables = props.variables ?? {};
    this.when = props.when ?? WhenStatement.ONSUCCESS;
  }

  /**
   *
   * @returns RenderedRule
   */
  render(): any {
    const renderedRule: RenderedRule = {
      if: this.ifStatement,
      changes: this.changes,
      exists: this.exists,
      variables: Object.keys(this.variables).length
        ? this.variables
        : undefined,
      when: this.when,
      allow_failure: this.allowFailure,
    };

    return renderedRule;
  }

  addVariables(variables: Variables): Rule {
    Object.entries(variables).forEach(([key, value]) => {
      this.variables[key] = value;
    });
    return this;
  }
  never(): Rule {
    const ruleCopy: Rule = deepcopy(this);
    ruleCopy.when = WhenStatement.NEVER;
    return ruleCopy;
  }

  isEqual(comparable: IBase): comparable is Rule {
    return (
      JSON.stringify(this.render()) === JSON.stringify(comparable.render())
    );
  }
}

/**
 * Represents a library of static methods to create rules for GitLab CI/CD
 * pipeline conditions.
 */
export class RuleLib {
  /**
   * Creates a rule that evaluates to true if the CI/CD pipeline is running on the specified branch.
   *
   * @param branchName - The name of the branch to check.
   * @returns A `Rule` object representing the condition for the specified branch.
   */
  public static onBranch(branchName: string): Rule {
    return new Rule({ ifStatement: `$CI_COMMIT_BRANCH == "${branchName}"` });
  }

  /**
   * Creates a rule that evaluates to true if the CI/CD pipeline is NOT running on the specified branch.
   *
   * @param branchName - The name of the branch to check.
   * @returns A `Rule` object representing the condition for NOT being on the specified branch.
   */
  public static notOnBranch(branchName: string): Rule {
    return new Rule({ ifStatement: `$CI_COMMIT_BRANCH != "${branchName}"` });
  }
  /**
   * Creates a rule that evaluates to true if the CI/CD pipeline is running on the "main" branch.
   *
   * @returns A `Rule` object representing the condition for the "main" branch.
   */
  public static onMain(): Rule {
    return RuleLib.onBranch("main");
  }
  /**
   * Creates a rule that evaluates to true if the CI/CD pipeline is NOT running on the "main" branch.
   *
   * @returns A `Rule` object representing the condition for NOT being on the "main" branch.
   */
  public static notOnMain(): Rule {
    return RuleLib.notOnBranch("main");
  }
  /**
   * Creates a rule that evaluates to true if the CI/CD pipeline is running on the "master" branch.
   *
   * @returns A `Rule` object representing the condition for the "master" branch.
   */
  public static onMaster(): Rule {
    return RuleLib.onBranch("master");
  }
  /**
   * Creates a rule that evaluates to true if the CI/CD pipeline is NOT running on the "master" branch.
   *
   * @returns A `Rule` object representing the condition for NOT being on the "master" branch.
   */
  public static notOnMaster(): Rule {
    return RuleLib.notOnBranch("master");
  }
  /**
   * Creates a rule that evaluates to true for merge request events in the CI/CD pipeline.
   *
   * @returns A `Rule` object representing the condition for merge request events.
   */
  public static onMergeRequestEvents(): Rule {
    return new Rule({
      ifStatement: '$CI_PIPELINE_SOURCE == "merge_request_event"',
    });
  }
  /**
   * Creates a rule that always evaluates to true (success).
   *
   * @returns A `Rule` object representing a success condition.
   */
  public static onSuccess(): Rule {
    return new Rule({});
  }
  /**
   * Creates a rule that evaluates to true for pipelines triggered by API or the trigger keyword.
   *
   * @returns A `Rule` object representing the condition for pipeline triggers.
   */
  public static onPipelineTrigger(): Rule {
    return new Rule({ ifStatement: '$CI_PIPELINE_SOURCE == "pipeline"' });
  }
  /**
   * Creates a rule that evaluates to true for CI/CD pipelines triggered by tags.
   *
   * @returns A `Rule` object representing the condition for tag-based pipelines.
   */
  public static onTags(): Rule {
    return new Rule({ ifStatement: "$CI_COMMIT_TAG" });
  }
}
