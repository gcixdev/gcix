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
  releaseTrigger: ReleaseTrigger.manual(),
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
gcixProject.addTask("ci:install:deps", {
  requiredEnv: ["CI"],
  description: "Install dependencies inside the CI environment.",
  steps: [
    { exec: "apt update && apt install -y python3-pip python3-venv jq rsync" },
    { spawn: "install:ci" },
  ],
});
gcixProject.addTask("ci:test", {
  requiredEnv: ["CI"],
  description: "Executes Jest tests.",
  steps: [{ spawn: "ci:install:deps" }, { spawn: "test" }],
});
gcixProject.addTask("ci:lint", {
  requiredEnv: ["CI"],
  description: "Executes eslint.",
  steps: [{ spawn: "ci:install:deps" }, { spawn: "eslint" }],
});
gcixProject.addTask("ci:publish:git", {
  description: `Creates a new git tag and generates the CHANGELOG.md from
  conventional commits`,
  requiredEnv: ["CI", "CI_COMMIT_REF_NAME"],
  env: {
    RELEASE: "true",
  },
  steps: [
    {
      exec: 'git clone --single-branch --branch "${CI_COMMIT_REF_NAME}" "https://gitlab-ci-token:${GCIX_PUSH_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git" "${CI_COMMIT_SHA}"',
    },
    { exec: "cd ${CI_COMMIT_SHA}" },
    {
      exec: "git checkout -B ${CI_COMMIT_REF_NAME} remotes/origin/${CI_COMMIT_REF_NAME} --",
    },
    { exec: 'git config --local user.name "${GITLAB_USER_NAME}"' },
    { exec: 'git config --local user.email "${GITLAB_USER_EMAIL}"' },
    { spawn: "ci:install:deps" },
    { exec: "rm -fr dist" },
    { spawn: "bump" },
    { spawn: "pre-compile" },
    { spawn: "compile" },
    { spawn: "package-all" },
    { spawn: "unbump" },
    { spawn: "publish:git" },
  ],
});
gcixProject.addTask("ci:package-all", {
  description: `Task which will install dependencies from lock, write the
    CI_COMMIT_TAG in package.json, spawns pre-compile, compile and package`,
  requiredEnv: ["CI", "CI_COMMIT_TAG"],
  steps: [
    { spawn: "ci:install:deps" },
    { exec: "scripts/update_package_json_version.sh" },
    { spawn: "pre-compile" },
    { spawn: "compile" },
    { spawn: "package-all" },
  ],
});
gcixProject.addTask("ci:publish-all", {
  description: "Publish produced artifacts to NPMjs and PyPi repository.",
  requiredEnv: [
    "CI",
    "CI_COMMIT_TAG",
    "NPM_TOKEN",
    "TWINE_USERNAME",
    "TWINE_PASSWORD",
  ],
  steps: [
    { spawn: "ci:install:deps" },
    { exec: "npm publish dist/js/*" },
    { exec: "pip install twine" },
    { exec: "twine upload dist/python/*" },
  ],
});
gcixProject.synth();
