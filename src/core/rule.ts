
import { IBase } from './base';
/**
 * This module represents the Gitlab CI [rules](https://docs.gitlab.com/ee/ci/yaml/#rules) keyword.
 *
 * Use rules to include or exclude jobs in pipelines.
 *
 * ```
 * myJob.prependRules(
 *     new Rule({
 *         ifStatement='$CI_COMMIT_BRANCH == "master"',
 *         changes: ["Dockerfile", "gcip/**"],
 *         exists: ["Dockerfile"],
 *         when=WhenStatement.ON_FAILURE,
 *         allowFailure: True,
 *         variables: { "SOME_VARIABLE": "foobar" },
 *         })
 *     )
 * ```
 */

type Variables = {[key: string]: string};

/**
 * @internal
 */
export interface RenderedRule {
  readonly rules: {
    readonly if?: string;
    readonly changes?: string[];
    readonly exists?: string[];
    readonly variables?: {[key: string]: string};
    readonly when?: WhenStatement;
    readonly allow_failure?: boolean;
  };
};

/**
 * This enum holds different [when](https://docs.gitlab.com/ee/ci/yaml/#when) statements for `Rule`s.
 */
export enum WhenStatement {
  ALWAYS = 'always',
  DELAYED = 'delayed',
  MANUAL = 'manual',
  NEVER = 'never',
  ONFAILURE = 'on_failure',
  ONSUCCESS = 'on_success',
}

export interface RuleProps {
  /**
     * @description The [rules:if clause](https://docs.gitlab.com/ee/ci/yaml/#when)
     * which decides when a job to the pipeline.
     */
  readonly ifStatement?: string;
  /**
     * @description The [when](https://docs.gitlab.com/ee/ci/yaml/#when) attribute which decides when to run a job.
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
  readonly variables?: {[key: string]: string};
};

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
};

export class Rule implements IRule {
  ifStatement?: string | undefined;
  allowFailure?: boolean | undefined;
  changes?: string[] | undefined;
  exists?: string[] | undefined;
  variables?: { [key: string]: string };
  when?: WhenStatement | undefined;

  constructor(props: RuleProps) {
    this.ifStatement = props.ifStatement;
    this.allowFailure = props.allowFailure ?? false;
    this.changes = props.changes;
    this.exists = props.exists;
    this.variables = props.variables;
    this.when = props.when ?? WhenStatement.ONSUCCESS;
  }

  /**
   *
   * @returns RenderedRule
   */
  render(): any {
    const renderedRule: RenderedRule = {
      rules: {
        if: this.ifStatement,
        changes: this.changes,
        exists: this.exists,
        variables: this.variables,
        when: this.when,
        allow_failure: this.allowFailure,
      },
    };

    return renderedRule;
  }

  addVariables(variables: Variables): Rule {
    /**
     * @TODO check if there is a better way to tell the compiler
     * that `this.variabels` is never null (!)
     */
    Object.entries(variables).forEach(([key, value]) => {
      this.variables![key] = value;
    });
    return this;
  }
  never(): Rule {
    const ruleCopy: Rule = { ...this };
    ruleCopy.when = WhenStatement.NEVER;
    return ruleCopy;
  }

  isEqual(comparable: IBase): comparable is Rule {
    return this.render() === comparable.render();
  }
}
