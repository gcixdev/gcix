import { cdk } from "projen";
import { NpmAccess } from "projen/lib/javascript";
import { ReleaseTrigger } from "projen/lib/release";

const gcixProject = new cdk.JsiiProject({
  author: "Daniel von Essen",
  copyrightOwner: "Daniel von Essen",
  authorAddress: "daniel@vonessen.eu",
  description: "GitLab CI X Library (X stands for multilanguage)",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.0.0",
  name: "@gcix/gcix",
  projenrcTs: true,
  repositoryUrl: "https://gitlab.com/gcix/gcix.git",
  docgen: true,
  github: false,
  minNodeVersion: "18.0.0",
  bundledDeps: ["js-yaml", "lodash"],
  devDeps: [
    "sanitize-filename",
    "ts-node",
    "tmp",
    "@types/tmp",
    "@types/lodash",
    "@types/js-yaml",
    "@types/jest",
  ],
  docsDirectory: "public",
  npmAccess: NpmAccess.PUBLIC,
  publishToPypi: {
    distName: "gcix",
    module: "gcix",
  },
  vscode: true,
  jestOptions: {
    jestConfig: {
      setupFiles: ["./test/set-env-vars.ts"],
    },
  },
  releaseTrigger: ReleaseTrigger.manual({ gitPushCommand: "" }),
  prettier: true,
  eslintOptions: {
    dirs: ["src"],
    ignorePatterns: [
      "*.js",
      "*.d.ts",
      "node_modules/",
      "*.generated.ts",
      "coverage",
      "!.gitlab-ci.ts",
    ],
  },
  tsconfig: {
    compilerOptions: {},
    include: [".gitlab-ci.ts"],
  },
  gitignore: ["generated-config.yml"],
});
gcixProject.vscode?.settings.addSettings({
  "editor.tabSize": 2,
  "conventionalCommits.scopes": ["projen"],
});

/**
 * Run test and update comparison files.
 */
gcixProject.addTask("test:update", {
  exec: "npx projen test",
  env: { UPDATE_TEST_OUTPUT: "true" },
});
/**
 * Generate pipeline from .gitlab-ci.ts
 */
gcixProject.addTask("gcix:gen", {
  exec: "npx ts-node .gitlab-ci.ts",
  description: "Execute .gitlab-ci.ts and generate 'generated-config.yml'",
});
/**
 * Add custom release tasks
 */
gcixProject.addTask("release:common", {
  steps: [
    { spawn: "install:ci" },
    { exec: "rm -fr dist" },
    { spawn: "bump" },
    { spawn: "pre-compile" },
    { spawn: "compile" },
    { spawn: "compile" },
    { spawn: "package" },
    { spawn: "unbump" },
    { spawn: "publish:git" },
  ],
});
gcixProject.addTask("release:pre", {
  env: {
    PRERELEASE: "pre",
  },
  steps: [{ spawn: "release:common" }],
});
gcixProject.addTask("release:tag", {
  env: {
    RELEASE: "true",
  },
  steps: [{ spawn: "release:common" }],
});
gcixProject.addTask("ci:package", {
  description: `Task which will install dependencies from lock, write the
    CI_COMMIT_TAG in package.json, spawns pre-compile, compile and package`,
  requiredEnv: ["CI"],
  steps: [
    { exec: "apt update && apt install -y python3-pip python3-venv jq" },
    { spawn: "install:ci" },
    { exec: "scripts/update_package_json_version.sh" },
    { spawn: "pre-compile" },
    { spawn: "compile" },
    { spawn: "package-all" },
  ],
});
gcixProject.addTask("ci:publish-pypi", {
  description: "Publish produced artifact to PyPi repository.",
  requiredEnv: ["CI", "CI_COMMIT_TAG", "TWINE_USERNAME", "TWINE_PASSWORD"],
  steps: [
    { exec: "apt update && apt install -y python3-pip" },
    { exec: "pip install twine" },
    { exec: "twine upload dist/python/*" },
  ],
});
gcixProject.addTask("ci:publish-npmjs", {
  description: "Publish produced artifact to npm registry.",
  requiredEnv: ["CI", "CI_COMMIT_TAG", "NPM_TOKEN"],
  exec: "npm publish dist/js/*",
});
gcixProject.synth();
