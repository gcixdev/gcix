/**
 * Checks if a given version string complies with Semantic Versioning (SemVer) specifications.
 *
 * @param version - The version string to be checked for SemVer compliance.
 * @returns `true` if the version string is SemVer compliant, otherwise `false`.
 *
 * @see [Semantic Versioning (SemVer)](https://semver.org/)
 * @see [Semantic Versioning Regex](https://regex101.com/r/vkijKf/1/)
 */
export function isSemver(version: string): boolean {
  return (
    version.match(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm,
    ) !== null
  );
}

if (require.main === module) {
  const ciCommitTag = process.env.CI_COMMIT_TAG;

  // check if CI_COMMIT_TAG is available in process.env
  if (ciCommitTag === undefined) {
    console.error("Environment variable CI_COMMIT_TAG must be set.");
    process.exit(1);
  }

  if (!isSemver(ciCommitTag)) {
    console.error(
      `'${ciCommitTag}' is not a valid Semver version. https://semver.org/`,
    );
    process.exit(1);
  }
}
