import * as _path from "path";

/**
 * GitlabScripts Class Documentation
 *
 * The `GitlabScripts` class provides utility methods for performing various Git-related actions in the context of GitLab.
 */
export class GitlabScripts {
  /**
   * Clones a repository from a remote Git server using the Git command.
   *
   * @param path - The path of the repository to clone. Should start with a forward slash ("/").
   * @param branch - (Optional) The branch name to clone from the remote repository. Currently, only "main" is supported.
   * @returns A Git clone command as a string with the provided branch and repository path.
   */
  static cloneRepository(path: string, branch?: string): string {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    if (!branch) {
      branch = "main";
    }
    return `git clone --branch ${branch} --single-branch https://gitlab-ci-token:\${CI_JOB_TOKEN}@\${CI_SERVER_HOST}${path}.git`;
  }

  private constructor() {}
}

/**
 * Ensures `subpath` is a subpath under `./public`.
 * @param subPath path which will be sanitized and appended to `./public`
 * @returns path `public/${subPath}`
 */
export function gitlabPagesPath(subPath: string): string {
  if (subPath !== "") {
    subPath = _path.normalize(subPath);

    if (_path.isAbsolute(subPath)) {
      subPath = subPath.replace(/\//, "");
    }
  }
  return _path.join("public", subPath);
}
