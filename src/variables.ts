/**
 * This module contains constants for [Gitlab CI predefined variables](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
 */

/**
 * This proxy delays the operating system query for environment variables
 * until the value is requested.
 *
 * This proxy is designed for requesting predefined environment variables that
 * must exist within a Gitlab CI pipeline execution. Create an object from
 * this proxy with the name of the Gitlab `CI_*` variable you want to query:
 * ```
 * CI_COMMIT_REF_SLUG = EnvProxy("CI_COMMIT_REF_SLUG")  # process.env.CI_* is
 * not! called here
 * ```
 *
 * When using an object of this proxy in a statement it returns the value of
 * the `CI_*` variable requested or throws an `Error` if against our
 * expectations the variable is not available.
 *
 * ```
 * if CI_COMMIT_REF_SLUG == "foobar":  # <- process.env.CI_* is called here
 * ```
 *
 * The proxy has a different behavior when not being called within a Gitlab CI
 * pipeline execution. This is, when the environment variable `CI` is
 * unset (from the official Gitlab CI docs). Then the proxy does not raise a
 * KeyError for `CI_*` variables, because they naturally does not exist
 * (or at least their existence is not guaranteed). So if we are not running
 * within a Gitlab CI pipeline, the proxy insteads returns the dummy string
 * `notRunningInAPipeline` for all `CI_*` variables. Except for the `CI`
 * variable itself, where an empty string is returned, indicating we are not
 * running within a pipeline.
 *
 * @param key The name of the environment variable that should be queried on request.
 * @returns The value of the queried environment variable.
 */
export function EnvProxy(key: string): string {
  if (process.env.CI && process.env.CI.toLowerCase() === "true") {
    const envVar = process.env[key];
    if (envVar) {
      return envVar;
    } else {
      throw new Error(`Environment variable ${key} not exported.`);
    }
  }

  /**
   * indicate that we are not running within a pipeline by
   * returning an empty string
   */
  if (key === "CI") {
    return "";
  }

  /**
   * in the case we are not running within a pipeline ($CI is empty)
   * for all other variables we return a dummy value which
   * explicitly describe this state
   */
  return process.env[key] ?? "notRunningInAPipeline";
}

export function OptionalEnvProxy(key: string): string | undefined {
  return process.env[key];
}

/**
 * This class contains constants for [Gitlab CI predefined variables](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
 */
export class PredefinedVariables {
  /**
   * Source chat channel which triggered the ChatOps command.
   *
   * Added in GitLab 10.6
   * Available in GitLab Runner all
   */
  static get chatChannel() {
    return EnvProxy("CHAT_CHANNEL");
  }

  /**
   * Additional arguments passed in the ChatOps command.
   *
   * Added in GitLab 10.6
   * Available in GitLab Runner all
   */
  static get chatInput() {
    return EnvProxy("CHAT_INPUT");
  }

  /**
   * Mark that job is executed in CI environment.
   *
   * Added in GitLab all
   * Available in GitLab Runner 0.4
   */
  static get ci() {
    return EnvProxy("CI");
  }

  /**
   * The GitLab API v4 root URL.
   *
   * Added in GitLab 11.7
   * Available in GitLab Runner all
   */
  static get ciApiV4Url() {
    return EnvProxy("CI_API_V4_URL");
  }

  /**
   * Top-level directory where builds are executed.
   *
   * Added in GitLab all
   * Available in GitLab Runner 11.10
   */
  static get ciBuildsDir() {
    return EnvProxy("CI_BUILDS_DIR");
  }

  /**
   * The previous latest commit present on a branch. Is always
   * 0000000000000000000000000000000000000000 in pipelines for merge requests.
   *
   * Added in GitLab 11.2
   * Available in GitLab Runner all
   */
  static get ciCommitBeforeSha() {
    return EnvProxy("CI_COMMIT_BEFORE_SHA");
  }

  /**
   * The description of the commit the message without first line,
   * if the title is shorter than 100 characters; full message in other case.
   *
   * Added in GitLab 10.8
   * Available in GitLab Runner all
   */
  static get ciCommitDescription() {
    return EnvProxy("CI_COMMIT_DESCRIPTION");
  }

  /**
   * The full commit message.
   *
   * Added in GitLab 10.8
   * Available in GitLab Runner all
   */
  static get ciCommitMessage() {
    return EnvProxy("CI_COMMIT_MESSAGE");
  }

  /**
   * The branch or tag name for which project is built.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner all
   */
  static get ciCommitRefName() {
    return EnvProxy("CI_COMMIT_REF_NAME");
  }

  /**
   * true if the job is running on a protected reference, false if not.
   *
   * Added in GitLab 11.11
   * Available in GitLab Runner all
   */
  static get ciCommitRefProtected() {
    return EnvProxy("CI_COMMIT_REF_PROTECTED");
  }

  /**
   * $CI_COMMIT_REF_NAME in lowercase, shortened to 63 bytes,
   * and with everything except 0-9 and a-z replaced with -.
   * No leading / trailing -. Use in URLs, host names and domain names.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner all
   */
  static get ciCommitRefSlug() {
    return EnvProxy("CI_COMMIT_REF_SLUG");
  }

  /**
   * The commit revision for which project is built.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner all
   */
  static get ciCommitSha() {
    return EnvProxy("CI_COMMIT_SHA");
  }

  /**
   * The first eight characters of CI_COMMIT_SHA.
   *
   * Added in GitLab 11.7
   * Available in GitLab Runner all
   */
  static get ciCommitShortSha() {
    return EnvProxy("CI_COMMIT_SHORT_SHA");
  }

  /**
   * The commit branch name. Present in branch pipelines,
   * including pipelines for the default branch.
   * Not present in merge request pipelines or tag pipelines.
   *
   * Added in GitLab 12.6
   * Available in GitLab Runner 0.5
   */
  static get ciCommitBranch() {
    return OptionalEnvProxy("CI_COMMIT_BRANCH");
  }

  /**
   * The commit tag name. Present only when building tags.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner 0.5
   */
  static get ciCommitTag() {
    return OptionalEnvProxy("CI_COMMIT_TAG");
  }

  /**
   * The title of the commit - the full first line of the message.
   *
   * Added in GitLab 10.8
   * Available in GitLab Runner all
   */
  static get ciCommitTitle() {
    return EnvProxy("CI_COMMIT_TITLE");
  }

  /**
   * The timestamp of the commit in the ISO 8601 format.
   *
   * Added in GitLab 13.4
   * Available in GitLab Runner all
   */
  static get ciCommitTimestamp() {
    return EnvProxy("CI_COMMIT_TIMESTAMP");
  }

  /**
   * Unique ID of build execution in a single executor.
   *
   * Added in GitLab all
   * Available in GitLab Runner 11.10
   */
  static get ciConcurrentId() {
    return EnvProxy("CI_CONCURRENT_ID");
  }

  /**
   * Unique ID of build execution in a single executor and project.
   *
   * Added in GitLab all
   * Available in GitLab Runner 11.10
   */
  static get ciConcurrentProjectId() {
    return EnvProxy("CI_CONCURRENT_PROJECT_ID");
  }

  /**
   * The path to CI configuration file. Defaults to .gitlab-ci.yml.
   *
   * Added in GitLab 9.4
   * Available in GitLab Runner 0.5
   */
  static get ciConfigPath() {
    return EnvProxy("CI_CONFIG_PATH");
  }

  /**
   * Whether debug logging (tracing) is enabled.
   *
   * Added in GitLab all
   * Available in GitLab Runner 1.7
   */
  static get ciDebugTrace() {
    return EnvProxy("CI_DEBUG_TRACE");
  }

  /**
   * The name of the default branch for the project.
   *
   * Added in GitLab 12.4
   * Available in GitLab Runner all
   */
  static get ciDefaultBranch() {
    return EnvProxy("CI_DEFAULT_BRANCH");
  }

  /**
   * The image prefix for pulling images through the Dependency Proxy.
   *
   * Added in GitLab 13.7
   * Available in GitLab Runner all
   */
  static get ciDependencyProxyGroupImagePrefix() {
    return EnvProxy("CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX");
  }

  /**
   * The server for logging in to the Dependency Proxy. This is equivalent to $CI_SERVER_HOST:$CI_SERVER_PORT.
   *
   * Added in GitLab 13.7
   * Available in GitLab Runner all
   */
  static get ciDependencyProxyServer() {
    return EnvProxy("CI_DEPENDENCY_PROXY_SERVER");
  }

  /**
   * The password to use to pull images through the Dependency Proxy.
   *
   * ATTENTION: Contrary to most other variables in this class, this variable is not resolved at rendering
   * time. Instead the variable string is returned, which is then resolved during pipeline execution.
   * This is because the value contains sensitive information.
   *
   * Added in GitLab 13.7
   * Available in GitLab Runner all
   */
  static get ciDependencyProxyPassword() {
    return "${CI_DEPENDENCY_PROXY_PASSWORD}";
  }

  /**
   * The username to use to pull images through the Dependency Proxy.
   *
   * Added in GitLab 13.7
   * Available in GitLab Runner all
   */
  static get ciDependencyProxyUser() {
    return EnvProxy("CI_DEPENDENCY_PROXY_USER");
  }

  /**
   * Included with the value true if the pipeline runs during a deploy freeze window.
   *
   * Added in GitLab 13.2
   * Available in GitLab Runner all
   */
  static get ciDeployFreeze() {
    return OptionalEnvProxy("CI_DEPLOY_FREEZE");
  }

  /**
   * Authentication password of the GitLab Deploy Token,
   * only present if the Project has one related.
   *
   * ATTENTION: Contrary to most other variables in this class, this variable is not resolved at rendering
   * time. Instead the variable string is returned, which is then resolved during pipeline execution.
   * This is because the value contains sensitive information.
   *
   * Added in GitLab 10.8
   * Available in GitLab Runner all
   */
  static get ciDeployPassword() {
    return "${CI_DEPLOY_PASSWORD}";
  }

  /**
   * Authentication username of the GitLab Deploy Token,
   * only present if the Project has one related.
   *
   * Added in GitLab 10.8
   * Available in GitLab Runner all
   */
  static get ciDeployUser() {
    return EnvProxy("CI_DEPLOY_USER");
  }

  /**
   * Marks that the job is executed in a disposable environment
   * (something that is created only for this job and disposed of/destroyed
   * after the execution - all executors except shell and ssh).
   * If the environment is disposable, it is set to true,
   * otherwise it is not defined at all.
   *
   * Added in GitLab all
   * Available in GitLab Runner 10.1
   */
  static get ciDisposableEnvironment() {
    return OptionalEnvProxy("CI_DISPOSABLE_ENVIRONMENT");
  }

  /**
   * The name of the environment for this job.
   * Only present if environment:name is set.
   *
   * Added in GitLab 8.15
   * Available in GitLab Runner all
   */
  static get ciEnvironmentName() {
    return OptionalEnvProxy("CI_ENVIRONMENT_NAME");
  }

  /**
   * A simplified version of the environment name,
   * suitable for inclusion in DNS, URLs, Kubernetes labels, and so on.
   * Only present if environment:name is set.
   *
   * Added in GitLab 8.15
   * Available in GitLab Runner all
   */
  static get ciEnvironmentSlug() {
    return OptionalEnvProxy("CI_ENVIRONMENT_SLUG");
  }

  /**
   * The URL of the environment for this job.
   * Only present if environment:url is set.
   *
   * Added in GitLab 9.3
   * Available in GitLab Runner all
   */
  static get ciEnvironmentUrl() {
    return OptionalEnvProxy("CI_ENVIRONMENT_URL");
  }

  /**
   * Pull Request ID from GitHub if the pipelines are for
   * external pull requests.
   * Available only if only [external_pull_requests] or
   * rules syntax is used and the pull request is open.
   *
   * Added in GitLab 12.3
   * Available in GitLab Runner all
   */
  static get ciExternalPullRequestIid() {
    return OptionalEnvProxy("CI_EXTERNAL_PULL_REQUEST_IID");
  }

  /**
   * The source repository name of the pull request if the pipelines are
   * for external pull requests. Available only if only
   * [external_pull_requests] or rules syntax is used and
   * the pull request is open.
   *
   * Added in GitLab 13.3
   * Available in GitLab Runner all
   */
  static get ciExternalPullRequestSourceRepository() {
    return OptionalEnvProxy("CI_EXTERNAL_PULL_REQUEST_SOURCE_REPOSITORY");
  }

  /**
   * The target repository name of the pull request if the pipelines
   * are for external pull requests. Available only if only
   * [external_pull_requests] or rules syntax is used and the pull
   * request is open.
   *
   * Added in GitLab 13.3
   * Available in GitLab Runner all
   */
  static get ciExternalPullRequestTargetRepository() {
    return OptionalEnvProxy("CI_EXTERNAL_PULL_REQUEST_TARGET_REPOSITORY");
  }

  /**
   * The source branch name of the pull request if the pipelines are for
   * external pull requests. Available only if only [external_pull_requests]
   * or rules syntax is used and the pull request is open.
   *
   * Added in GitLab 12.3
   * Available in GitLab Runner all
   */
  static get ciExternalPullRequestSourceBranchName() {
    return OptionalEnvProxy("CI_EXTERNAL_PULL_REQUEST_SOURCE_BRANCH_NAME");
  }

  /**
   * The HEAD SHA of the source branch of the pull request if the pipelines
   * are for external pull requests. Available only if only
   * [external_pull_requests] or rules syntax is used and the pull
   * request is open.
   *
   * Added in GitLab 12.3
   * Available in GitLab Runner all
   */
  static get ciExternalPullRequestSourceBranchSha() {
    return OptionalEnvProxy("CI_EXTERNAL_PULL_REQUEST_SOURCE_BRANCH_SHA");
  }

  /**
   * The target branch name of the pull request if the pipelines are for
   * external pull requests. Available only if only [external_pull_requests]
   * or rules syntax is used and the pull request is open.
   *   *
   * Added in GitLab 12.3
   * Available in GitLab Runner all
   */
  static get ciExternalPullRequestTargetBranchName() {
    return OptionalEnvProxy("CI_EXTERNAL_PULL_REQUEST_TARGET_BRANCH_NAME");
  }

  /**
   * The HEAD SHA of the target branch of the pull request if the pipelines
   * are for external pull requests. Available only if only
   * [external_pull_requests] or rules syntax is used and the pull
   * request is open.
   *
   * Added in GitLab 12.3
   * Available in GitLab Runner all
   */
  static get ciExternalPullRequestTargetBranchSha() {
    return OptionalEnvProxy("CI_EXTERNAL_PULL_REQUEST_TARGET_BRANCH_SHA");
  }

  /**
   * Included with the value true only if the pipeline’s project has any
   * open requirements. Not included if there are no open requirements for
   * the pipeline’s project.
   *
   * Added in GitLab 13.1
   * Available in GitLab Runner all
   */
  static get ciHasOpenRequirements() {
    return OptionalEnvProxy("CI_HAS_OPEN_REQUIREMENTS");
  }

  /**
   * Available in branch and merge request pipelines. Contains a
   * comma-separated list of up to four merge requests that use the current
   * branch and project as the merge request source.
   * For example gitlab-org/gitlab!333,gitlab-org/gitlab-foss!11.
   *
   * Added in GitLab 13.8
   * Available in GitLab Runner all
   */
  static get ciOpenMergeRequests() {
    return OptionalEnvProxy("CI_OPEN_MERGE_REQUESTS");
  }

  /**
   * The unique ID of the current job that GitLab CI/CD uses internally.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner all
   */
  static get ciJobId() {
    return EnvProxy("CI_JOB_ID");
  }

  /**
   * The name of the image running the CI job.
   *
   * Added in GitLab 12.9
   * Available in GitLab Runner 12.9
   */
  static get ciJobImage() {
    return EnvProxy("CI_JOB_IMAGE");
  }

  /**
   * The flag to indicate that job was manually started.
   *
   * Added in GitLab 8.12
   * Available in GitLab Runner all
   */
  static get ciJobManual() {
    return EnvProxy("CI_JOB_MANUAL");
  }

  /**
   * The name of the job as defined in .gitlab-ci.yml.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner 0.5
   */
  static get ciJobName() {
    return EnvProxy("CI_JOB_NAME");
  }

  /**
   * The name of the stage as defined in .gitlab-ci.yml.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner 0.5
   */
  static get ciJobStage() {
    return EnvProxy("CI_JOB_STAGE");
  }

  /**
   * The state of the job as each runner stage is executed.
   * Use with after_script where CI_JOB_STATUS can be either success,
   * failed or canceled.
   *
   * Added in GitLab all
   * Available in GitLab Runner 13.5
   */
  static get ciJobStatus() {
    return EnvProxy("CI_JOB_STATUS");
  }

  /**
   * Token used for authenticating with a few API endpoints and downloading
   * dependent repositories. The token is valid as long as the job is running.
   *
   * ATTENTION: Contrary to most other variables in this class, this variable is not resolved at rendering
   * time. Instead the variable string is returned, which is then resolved during pipeline execution.
   * This is because the value contains sensitive information.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner 1.2
   */
  static get ciJobToken() {
    return "${CI_JOB_TOKEN}";
  }

  /**
   * RS256 JSON web token that can be used for authenticating with third
   * party systems that support JWT authentication, for example HashiCorp’s Vault.
   *
   * ATTENTION: Contrary to most other variables in this class, this variable is not resolved at rendering
   * time. Instead the variable string is returned, which is then resolved during pipeline execution.
   * This is because the value contains sensitive information.
   *
   * Added in GitLab 12.10
   * Available in GitLab Runner all
   */
  static get ciJobJwt() {
    return "${CI_JOB_JWT}";
  }

  /**
   * Job details URL.
   *
   * Added in GitLab 11.1
   * Available in GitLab Runner 0.5
   */
  static get ciJobUrl() {
    return EnvProxy("CI_JOB_URL");
  }

  /**
   * Included with the value true only if the pipeline has a Kubernetes
   * cluster available for deployments. Not included if no cluster is available.
   * Can be used as an alternative to only:kubernetes/except:kubernetes
   * with rules:if.
   *
   * Added in GitLab 13.0
   * Available in GitLab Runner all
   */
  static get ciKubernetesActive() {
    return OptionalEnvProxy("CI_KUBERNETES_ACTIVE");
  }

  /**
   * Comma-separated list of username(s) of assignee(s) for the merge request
   * if the pipelines are for merge requests.
   * Available only if only [merge_requests] or rules syntax is used and the
   * merge request is created.
   *
   * Added in GitLab 11.9
   * Available in GitLab Runner all
   */
  static get ciMergeRequestAssignees() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_ASSIGNEES");
  }

  /**
   * The instance-level ID of the merge request. Only available if the
   * pipelines are for merge requests and the merge request is created.
   * This is a unique ID across all projects on GitLab.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestId() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_ID");
  }

  /**
   * The project-level IID (internal ID) of the merge request.
   * Only available If the pipelines are for merge requests and the merge
   * request is created. This ID is unique for the current project.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestIid() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_IID");
  }

  /**
   * Comma-separated label names of the merge request if the pipelines are
   * for merge requests. Available only if only [merge_requests] or rules
   * syntax is used and the merge request is created.
   *
   * Added in GitLab 11.9
   * Available in GitLab Runner all
   */
  static get ciMergeRequestLabels() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_LABELS");
  }

  /**
   * The milestone title of the merge request if the pipelines are for merge
   * requests. Available only if only [merge_requests] or rules syntax is
   * used and the merge request is created.
   *
   * Added in GitLab 11.9
   * Available in GitLab Runner all
   */
  static get ciMergeRequestMilestone() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_MILESTONE");
  }

  /**
   * The ID of the project of the merge request if the pipelines are for
   * merge requests. Available only if only [merge_requests] or rules syntax
   * is used and the merge request is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestProjectId() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_PROJECT_ID");
  }

  /**
   * The path of the project of the merge request if the pipelines are for
   * merge requests (for example stage/awesome-project). Available only
   * if only [merge_requests] or rules syntax is used and the merge request
   * is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestProjectPath() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_PROJECT_PATH");
  }

  /**
   * The URL of the project of the merge request if the pipelines are for
   * merge requests (for example http://192.168.10.15:3000/stage/awesome-project).
   * Available only if only [merge_requests] or rules syntax is used and the merge
   * request is created.
   *   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestProjectUrl() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_PROJECT_URL");
  }

  /**
   * The ref path of the merge request if the pipelines are for merge requests.
   * (for example refs/merge-requests/1/head). Available only if only
   * [merge_requests] or rules syntax is used and the merge request is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestRefPath() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_REF_PATH");
  }

  /**
   * The source branch name of the merge request if the pipelines are for
   * merge requests. Available only if only [merge_requests] or rules syntax
   * is used and the merge request is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestSourceBranchName() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_SOURCE_BRANCH_NAME");
  }

  /**
   * The HEAD SHA of the source branch of the merge request if the pipelines
   * are for merge requests. Available only if only [merge_requests] or rules
   * syntax is used, the merge request is created, and the pipeline is a
   * merged result pipeline.
   *
   * Added in GitLab 11.9
   * Available in GitLab Runner all
   */
  static get ciMergeRequestSourceBranchSha() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_SOURCE_BRANCH_SHA");
  }

  /**
   * The ID of the source project of the merge request if the pipelines are
   * for merge requests. Available only if only [merge_requests] or rules
   * syntax is used and the merge request is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestSourceProjectId() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_SOURCE_PROJECT_ID");
  }

  /**
   * The path of the source project of the merge request if the pipelines
   * are for merge requests. Available only if only [merge_requests] or
   * rules syntax is used and the merge request is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestSourceProjectPath() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_SOURCE_PROJECT_PATH");
  }

  /**
   * The URL of the source project of the merge request if the pipelines are
   * for merge requests. Available only if only [merge_requests] or rules
   * syntax is used and the merge request is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestSourceProjectUrl() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_SOURCE_PROJECT_URL");
  }

  /**
   * The target branch name of the merge request if the pipelines are for
   * merge requests. Available only if only [merge_requests] or rules syntax
   * is used and the merge request is created.
   *
   * Added in GitLab 11.6
   * Available in GitLab Runner all
   */
  static get ciMergeRequestTargetBranchName() {
    return EnvProxy("CI_MERGE_REQUEST_TARGET_BRANCH_NAME");
  }

  /**
   * The HEAD SHA of the target branch of the merge request if the pipelines
   * are for merge requests. Available only if only [merge_requests] or rules
   * syntax is used, the merge request is created, and the pipeline is a merged
   * result pipeline.
   *
   * Added in GitLab 11.9
   * Available in GitLab Runner all
   */
  static get ciMergeRequestTargetBranchSha() {
    return EnvProxy("CI_MERGE_REQUEST_TARGET_BRANCH_SHA");
  }

  /**
   * The title of the merge request if the pipelines are for merge requests.
   * Available only if only [merge_requests] or rules syntax is used and the
   * merge request is created.
   *
   * Added in GitLab 11.9
   * Available in GitLab Runner all
   */
  static get ciMergeRequestTitle() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_TITLE");
  }

  /**
   * The event type of the merge request, if the pipelines are for merge requests.
   * Can be detached, merged_result or merge_train.
   *
   * Added in GitLab 12.3
   * Available in GitLab Runner all
   */
  static get ciMergeRequestEventType() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_EVENT_TYPE");
  }

  /**
   * The version of the merge request diff, if the pipelines are for merge requests.
   *
   * Added in GitLab 13.7
   * Available in GitLab Runner all
   */
  static get ciMergeRequestDiffId() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_DIFF_ID");
  }

  /**
   * The base SHA of the merge request diff, if the pipelines are for merge requests.
   *
   * Added in GitLab 13.7
   * Available in GitLab Runner all
   */
  static get ciMergeRequestDiffBaseSha() {
    return OptionalEnvProxy("CI_MERGE_REQUEST_DIFF_BASE_SHA");
  }

  /**
   * Index of the job in the job set. If the job is not parallelized, this variable is not set.
   *
   * Added in GitLab 11.5
   * Available in GitLab Runner all
   */
  static get ciNodeIndex() {
    return OptionalEnvProxy("CI_NODE_INDEX");
  }

  /**
   * Total number of instances of this job running in parallel. If the job is not parallelized, this variable is set to 1.
   *
   * Added in GitLab 11.5
   * Available in GitLab Runner all
   */
  static get ciNodeTotal() {
    return EnvProxy("CI_NODE_TOTAL");
  }

  /**
   * The configured domain that hosts GitLab Pages.
   *
   * Added in GitLab 11.8
   * Available in GitLab Runner all
   */
  static get ciPagesDomain() {
    return EnvProxy("CI_PAGES_DOMAIN");
  }

  /**
   * URL to GitLab Pages-built pages. Always belongs to a subdomain of CI_PAGES_DOMAIN.
   *
   * Added in GitLab 11.8
   * Available in GitLab Runner all
   */
  static get ciPagesUrl() {
    return EnvProxy("CI_PAGES_URL");
  }

  /**
   * The instance-level ID of the current pipeline. This is a unique ID
   * across all projects on GitLab.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner all
   */
  static get ciPipelineId() {
    return EnvProxy("CI_PIPELINE_ID");
  }

  /**
   * The project-level IID (internal ID) of the current pipeline.
   * This ID is unique for the current project.
   *
   * Added in GitLab 11.0
   * Available in GitLab Runner all
   */
  static get ciPipelineIid() {
    return EnvProxy("CI_PIPELINE_IID");
  }

  /**
   * Indicates how the pipeline was triggered.
   * Possible options are push, web, schedule, api, external, chat, webide,
   * merge_request_event, external_pull_request_event, parent_pipeline,
   * trigger, or pipeline.
   * For pipelines created before GitLab 9.5, this is displayed as unknown.
   *
   * Added in GitLab 10.0
   * Available in GitLab Runner all
   */
  static get ciPipelineSource() {
    return EnvProxy("CI_PIPELINE_SOURCE");
  }

  /**
   * The flag to indicate that job was triggered.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get ciPipelineTriggered() {
    return EnvProxy("CI_PIPELINE_TRIGGERED");
  }

  /**
   * Pipeline details URL.
   *
   * Added in GitLab 11.1
   * Available in GitLab Runner 0.5
   */
  static get ciPipelineUrl() {
    return EnvProxy("CI_PIPELINE_URL");
  }

  /**
   * The CI configuration path for the project.
   *
   * Added in GitLab 13.8
   * Available in GitLab Runner all
   */
  static get ciProjectConfigPath() {
    return EnvProxy("CI_PROJECT_CONFIG_PATH");
  }

  /**
   * The full path where the repository is cloned and where the job is run.
   * If the GitLab Runner builds_dir parameter is set, this variable is set
   * relative to the value of builds_dir. For more information, see Advanced
   * configuration for GitLab Runner.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get ciProjectDir() {
    return EnvProxy("CI_PROJECT_DIR");
  }

  /**
   * The unique ID of the current project that GitLab CI/CD uses internally.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get ciProjectId() {
    return EnvProxy("CI_PROJECT_ID");
  }

  /**
   * The name of the directory for the project that is being built.
   * For example, if the project URL is gitlab.example.com/group-name/project-1,
   * the CI_PROJECT_NAME would be project-1.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciProjectName() {
    return EnvProxy("CI_PROJECT_NAME");
  }

  /**
   * The project stage (username or group name) that is being built.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciProjectNamespace() {
    return EnvProxy("CI_PROJECT_NAMESPACE");
  }

  /**
   * The root project stage (username or group name) that is being built.
   * For example, if CI_PROJECT_NAMESPACE is root-group/child-group/grandchild-group,
   * CI_PROJECT_ROOT_NAMESPACE would be root-group.
   *
   * Added in GitLab 13.2
   * Available in GitLab Runner 0.5
   */
  static get ciProjectRootNamespace() {
    return EnvProxy("CI_PROJECT_ROOT_NAMESPACE");
  }

  /**
   * The stage with project name.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciProjectPath() {
    return EnvProxy("CI_PROJECT_PATH");
  }

  /**
   * $CI_PROJECT_PATH in lowercase and with everything except 0-9 and a-z replaced with -. Use in URLs and domain names.
   *
   * Added in GitLab 9.3
   * Available in GitLab Runner all
   */
  static get ciProjectPathSlug() {
    return EnvProxy("CI_PROJECT_PATH_SLUG");
  }

  /**
   * Comma-separated, lowercase list of the languages used in the repository (for example ruby,javascript,html,css).
   *
   * Added in GitLab 12.3
   * Available in GitLab Runner all
   */
  static get ciProjectRepositoryLanguages() {
    return EnvProxy("CI_PROJECT_REPOSITORY_LANGUAGES");
  }

  /**
   * The human-readable project name as displayed in the GitLab web interface.
   *
   * Added in GitLab 12.4
   * Available in GitLab Runner all
   */
  static get ciProjectTitle() {
    return EnvProxy("CI_PROJECT_TITLE");
  }

  /**
   * The HTTP(S) address to access project.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciProjectUrl() {
    return EnvProxy("CI_PROJECT_URL");
  }

  /**
   * The project visibility (internal, private, public).
   *
   * Added in GitLab 10.3
   * Available in GitLab Runner all
   */
  static get ciProjectVisibility() {
    return EnvProxy("CI_PROJECT_VISIBILITY");
  }

  /**
   * GitLab Container Registry. This variable includes a :port value if one
   * has been specified in the registry configuration.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciRegistry() {
    return OptionalEnvProxy("CI_REGISTRY");
  }

  /**
   * the address of the registry tied to the specific project.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciRegistryImage() {
    return OptionalEnvProxy("CI_REGISTRY_IMAGE");
  }

  /**
   * The password to use to push containers to the GitLab Container Registry, for the current project.
   *
   * ATTENTION: Contrary to most other variables in this class, this variable is not resolved at rendering
   * time. Instead the variable string is returned, which is then resolved during pipeline execution.
   * This is because the value contains sensitive information.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner all
   */
  static get ciRegistryPassword() {
    return "${CI_REGISTRY_PASSWORD}";
  }

  /**
   * The username to use to push containers to the GitLab Container Registry, for the current project.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner all
   */
  static get ciRegistryUser() {
    return OptionalEnvProxy("CI_REGISTRY_USER");
  }

  /**
   * The URL to clone the Git repository.
   *
   * ATTENTION: Contrary to most other variables in this class, this variable is not resolved at rendering
   * time. Instead the variable string is returned, which is then resolved during pipeline execution.
   * This is because the value contains sensitive information.
   *
   * Added in GitLab 9.0
   * Available in GitLab Runner all
   */
  static get ciRepositoryUrl() {
    return "${CI_REPOSITORY_URL}";
  }

  /**
   * The description of the runner as saved in GitLab.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciRunnerDescription() {
    return EnvProxy("CI_RUNNER_DESCRIPTION");
  }

  /**
   * The OS/architecture of the GitLab Runner executable (note that this is not necessarily the same as the environment of the executor).
   *
   * Added in GitLab all
   * Available in GitLab Runner 10.6
   */
  static get ciRunnerExecutableArch() {
    return EnvProxy("CI_RUNNER_EXECUTABLE_ARCH");
  }

  /**
   * The unique ID of runner being used.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciRunnerId() {
    return EnvProxy("CI_RUNNER_ID");
  }

  /**
   * GitLab Runner revision that is executing the current job.
   *
   * Added in GitLab all
   * Available in GitLab Runner 10.6
   */
  static get ciRunnerRevision() {
    return EnvProxy("CI_RUNNER_REVISION");
  }

  /**
   * First eight characters of the runner’s token used to authenticate new job requests. Used as the runner’s unique ID.
   *
   * ATTENTION: Contrary to most other variables in this class, this variable is not resolved at rendering
   * time. Instead the variable string is returned, which is then resolved during pipeline execution.
   * This is because the value contains sensitive information.
   *
   * Added in GitLab all
   * Available in GitLab Runner 12.3
   */
  static get ciRunnerShortToken() {
    return "${CI_RUNNER_SHORT_TOKEN}";
  }

  /**
   * The defined runner tags.
   *
   * Added in GitLab 8.10
   * Available in GitLab Runner 0.5
   */
  static get ciRunnerTags() {
    return EnvProxy("CI_RUNNER_TAGS");
  }

  /**
   * GitLab Runner version that is executing the current job.
   *
   * Added in GitLab all
   * Available in GitLab Runner 10.6
   */
  static get ciRunnerVersion() {
    return EnvProxy("CI_RUNNER_VERSION");
  }

  /**
   * Mark that job is executed in CI environment.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get ciServer() {
    return EnvProxy("CI_SERVER");
  }

  /**
   * The base URL of the GitLab instance, including protocol and port (like https://gitlab.example.com:8080).
   *
   * Added in GitLab 12.7
   * Available in GitLab Runner all
   */
  static get ciServerUrl() {
    return EnvProxy("CI_SERVER_URL");
  }

  /**
   * Host component of the GitLab instance URL, without protocol and port (like gitlab.example.com).
   *
   * Added in GitLab 12.1
   * Available in GitLab Runner all
   */
  static get ciServerHost() {
    return EnvProxy("CI_SERVER_HOST");
  }

  /**
   * Port component of the GitLab instance URL, without host and protocol (like 3000).
   *
   * Added in GitLab 12.8
   * Available in GitLab Runner all
   */
  static get ciServerPort() {
    return EnvProxy("CI_SERVER_PORT");
  }

  /**
   * Protocol component of the GitLab instance URL, without host and port (like https).
   *
   * Added in GitLab 12.8
   * Available in GitLab Runner all
   */
  static get ciServerProtocol() {
    return EnvProxy("CI_SERVER_PROTOCOL");
  }

  /**
   * The name of CI server that is used to coordinate jobs.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get ciServerName() {
    return EnvProxy("CI_SERVER_NAME");
  }

  /**
   * GitLab revision that is used to schedule jobs.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get ciServerRevision() {
    return EnvProxy("CI_SERVER_REVISION");
  }

  /**
   * GitLab version that is used to schedule jobs.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get ciServerVersion() {
    return EnvProxy("CI_SERVER_VERSION");
  }

  /**
   * GitLab version major component.
   *
   * Added in GitLab 11.4
   * Available in GitLab Runner all
   */
  static get ciServerVersionMajor() {
    return EnvProxy("CI_SERVER_VERSION_MAJOR");
  }

  /**
   * GitLab version minor component.
   *
   * Added in GitLab 11.4
   * Available in GitLab Runner all
   */
  static get ciServerVersionMinor() {
    return EnvProxy("CI_SERVER_VERSION_MINOR");
  }

  /**
   * GitLab version patch component.
   *
   * Added in GitLab 11.4
   * Available in GitLab Runner all
   */
  static get ciServerVersionPatch() {
    return EnvProxy("CI_SERVER_VERSION_PATCH");
  }

  /**
   * Marks that the job is executed in a shared environment (something that
   * is persisted across CI invocations like shell or ssh executor).
   * If the environment is shared, it is set to true, otherwise it is not
   * defined at all.
   *
   * Added in GitLab all
   * Available in GitLab Runner 10.1
   */
  static get ciSharedEnvironment() {
    return OptionalEnvProxy("CI_SHARED_ENVIRONMENT");
  }

  /**
   * Mark that job is executed in GitLab CI/CD environment.
   *
   * Added in GitLab all
   * Available in GitLab Runner all
   */
  static get gitlabCi() {
    return EnvProxy("GITLAB_CI");
  }

  /**
   * The comma separated list of licensed features available for your instance and plan.
   *
   * Added in GitLab 10.6
   * Available in GitLab Runner all
   */
  static get gitlabFeatures() {
    return EnvProxy("GITLAB_FEATURES");
  }

  /**
   * The email of the user who started the job.
   *
   * Added in GitLab 8.12
   * Available in GitLab Runner all
   */
  static get gitlabUserEmail() {
    return EnvProxy("GITLAB_USER_EMAIL");
  }

  /**
   * The ID of the user who started the job.
   *
   * Added in GitLab 8.12
   * Available in GitLab Runner all
   */
  static get gitlabUserId() {
    return EnvProxy("GITLAB_USER_ID");
  }

  /**
   * The login username of the user who started the job.
   *
   * Added in GitLab 10.0
   * Available in GitLab Runner all
   */
  static get gitlabUserLogin() {
    return EnvProxy("GITLAB_USER_LOGIN");
  }

  /**
   * The real name of the user who started the job.
   *
   * Added in GitLab 10.0
   * Available in GitLab Runner all
   */
  static get gitlabUserName() {
    return EnvProxy("GITLAB_USER_NAME");
  }

  /**
   * This variable is available when a pipeline is triggered with a webhook
   *
   * Added in GitLab 13.9
   * Available in GitLab Runner all
   */
  static get triggerPayload() {
    return OptionalEnvProxy("TRIGGER_PAYLOAD");
  }
}
