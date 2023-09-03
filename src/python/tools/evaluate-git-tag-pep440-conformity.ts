#! /usr/bin/env node

/**
 * https://www.python.org/dev/peps/pep-0440/#appendix-b-parsing-version-strings-with-regular-expressions
 */
export function evaluateGitTagPep440Conformity(gitTag: string): boolean {
  return (
    gitTag.match(
      /^([1-9][0-9]*!)?(0|[1-9][0-9]*)(\.(0|[1-9][0-9]*))*((a|b|rc)(0|[1-9][0-9]*))?(\.post(0|[1-9][0-9]*))?(\.dev(0|[1-9][0-9]*))?$/,
    ) !== null
  );
}

function main() {
  const commitTag = process.env.CI_COMMIT_TAG;
  if (!commitTag) {
    throw new Error("Environment variable CI_COMMIT_TAG must be set.");
  }

  if (evaluateGitTagPep440Conformity(commitTag)) {
    process.exit(0);
  }

  console.error(`'${commitTag}' is not a valid Python package version.`);
  console.error("See https://www.python.org/dev/peps/pep-0440");
  process.exit(1);
}

if (require.main === module) {
  main();
}
