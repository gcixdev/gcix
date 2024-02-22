import { cdk } from "projen";
import { NpmAccess } from "projen/lib/javascript";
import { RequirementsFile, Venv } from "projen/lib/python";
import { ReleaseTrigger } from "projen/lib/release";

const gcixProject = new cdk.JsiiProject({
  author: "Daniel von Essen",
  copyrightOwner: "Daniel von Essen",
  authorAddress: "daniel@vonessen.eu",
  description: "GitLab CI X Library (X stands for multilanguage)",
  homepage: "https://docs.gcix.dev",
  keywords: ["ci", "gitlab", "gitlab-ci", "gcix", "gcip", "jsii"],
  bugsEmail: "bug@gcix.dev",
  bugsUrl: "https://gitlab.com/gcix/gcix/-/issues/new",
  repository: "https://gitlab.com/gcix/gcix.git",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.3.0",
  name: "@gcix/gcix",
  projenrcTs: true,
  repositoryUrl: "https://gitlab.com/gcix/gcix.git",
  docgen: true,
  github: false,
  minNodeVersion: "20.0.0",
  bundledDeps: [
    "js-yaml",
    "lodash",
    "yargs",
    "@aws-sdk/client-sts",
    "@aws-sdk/client-cloudformation",
  ],
  devDeps: [
    "sanitize-filename",
    "ts-node",
    "tmp",
    "@types/tmp",
    "@types/lodash",
    "@types/js-yaml",
    "@types/jest",
    "@types/yargs",
    "aws-sdk-client-mock",
    "aws-sdk-client-mock-jest",
  ],
  bin: {
    cfnwaiter: "lib/aws/tools/cfnwaiter.js",
    gittagpep440conformity:
      "lib/python/tools/evaluate-git-tag-pep440-conformity.js",
  },
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
  gitignore: [
    "generated-config.yml",
    "__pycache__",
    "/docs/api/",
    "!/docs/api/index.md",
  ],
  renovatebot: true,
  renovatebotOptions: {
    overrideConfig: {
      packageRules: [
        {
          matchDepTypes: ["devDependencies"],
          matchUpdateTypes: ["patch", "minor"],
          groupName: "devDependencies (non-major)",
        },
        {
          matchManagers: ["gitlabci"],
          matchPackageNames: ["node"],
          versioning: "node",
        },
      ],
    },
  },
  versionrcOptions: {
    types: [
      { type: "feat", section: "Features" },
      { type: "perf", section: "Features" },
      { type: "fix", section: "Bug Fixes" },
      { type: "chore", section: "Chore" },
      { type: "docs", section: "Documentation" },
      { type: "style", section: "Chore" },
      { type: "refactor", section: "Chore" },
      { type: "test", section: "Tests" },
    ],
  },
});
gcixProject.vscode?.settings.addSettings({
  "editor.tabSize": 2,
  "conventionalCommits.scopes": [
    "projen",
    "cfnwaiter",
    "core",
    "addons",
    "deps",
  ],
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
gcixProject.addTask("ci:compile", {
  requiredEnv: ["CI"],
  description: "Compiles the project.",
  steps: [{ spawn: "ci:install:deps" }, { spawn: "compile" }],
});
gcixProject.addTask("ci:package", {
  requiredEnv: ["CI"],
  description: "packages the project.",
  steps: [{ spawn: "ci:install:deps" }, { spawn: "package" }],
});
gcixProject.addTask("ci:setup:git", {
  description: "Setup git clone for further building.",
  requiredEnv: [
    "CI",
    "CI_COMMIT_REF_NAME",
    "CI_COMMIT_SHORT_SHA",
    "GCIX_PUSH_USER",
    "GCIX_PUSH_TOKEN",
    "CI_SERVER_HOST",
    "CI_PROJECT_PATH",
    "GITLAB_USER_NAME",
    "GITLAB_USER_EMAIL",
  ],
  steps: [
    {
      exec: 'git clone --single-branch --branch "${CI_COMMIT_REF_NAME}" "https://${GCIX_PUSH_USER}:${GCIX_PUSH_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git" "${CI_COMMIT_SHORT_SHA}"',
    },
    {
      exec: "cd ${CI_COMMIT_SHORT_SHA} && git checkout -B ${CI_COMMIT_REF_NAME} remotes/origin/${CI_COMMIT_REF_NAME} --",
    },
    {
      exec: 'cd ${CI_COMMIT_SHORT_SHA} && git config --local user.name "${GITLAB_USER_NAME}"',
    },
    {
      exec: 'cd ${CI_COMMIT_SHORT_SHA} && git config --local user.email "${GITLAB_USER_EMAIL}"',
    },
  ],
});
gcixProject.addTask("ci:publish:git", {
  description: `Creates a new git tag and generates the CHANGELOG.md from
  conventional commits`,
  requiredEnv: ["CI"],
  env: {
    RELEASE: "true",
  },
  steps: [
    { spawn: "ci:setup:git" },
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
  requiredEnv: ["CI"],
  steps: [
    { spawn: "ci:install:deps" },
    {
      exec: "pip install -U setuptools || pip install -U --break-system-packages setuptools",
    },
    { exec: "scripts/update_package_json_version.sh" },
    { spawn: "pre-compile" },
    { spawn: "compile" },
    { spawn: "package-all" },
  ],
});
gcixProject.addTask("ci:publish:npm", {
  description: "Publish produced artifacts to NPMjs registry.",
  requiredEnv: ["CI", "CI_COMMIT_TAG", "NPM_TOKEN"],
  steps: [
    { spawn: "ci:install:deps" },
    { exec: "npm config set //registry.npmjs.org/:_authToken ${NPM_TOKEN}" },
    { exec: "npm publish dist/js/*" },
  ],
});

gcixProject.addTask("ci:publish:pypi", {
  description: "Publish produced artifacts to PyPi repository.",
  requiredEnv: ["CI", "CI_COMMIT_TAG", "TWINE_USERNAME", "TWINE_PASSWORD"],
  steps: [
    { spawn: "ci:install:deps" },
    {
      exec: "pip install -U twine || pip install --break-system-packages -U twine",
    },
    { exec: "twine upload dist/python/*" },
  ],
});
gcixProject.synth();

/**
 * Create virtualenv, requirements file to allow building and writing
 * documentation with mkdocs for material.
 */
const pythonVenv = new Venv(gcixProject, { pythonExec: "python3.11" });
pythonVenv.setupEnvironment();

const pythonReqirements = new RequirementsFile(
  gcixProject,
  "requirements.txt",
  {},
);
pythonReqirements.addPackages(
  "mkdocs-material@9.*",
  "mkdocs-macros-plugin",
  "mkdocs-git-revision-date-localized-plugin",
  "mkdocs-git-authors-plugin",
  "mkdocs-literate-nav",
  "mike@2.*",
);

gcixProject.addTask("docs:dependencies", {
  exec: "source .env/bin/activate && pip3 install -r requirements.txt",
  description: "Install all requirements to build the documentation.",
});
gcixProject.addTask("docs:serve", {
  exec: "mkdocs serve",
  description:
    "Start mkdocs in serve mode to allow writing local documentation.",
});
/**
 * docgen with jsii
 */
gcixProject.addTask("docs:api", {
  description: "Generate api documentation with jsii-docgen",
  steps: [
    { spawn: "compile" },
    {
      exec: "npx jsii-docgen --readme false -l typescript -l python --submodule root --output root",
    },
    {
      exec: "npx jsii-docgen --readme false -l typescript -l python --split-by-submodule",
    },
    {
      exec: 'find . -maxdepth 1 -type f -name "[a-z]*.*.md" -exec mv {} docs/api/ \\;',
    },
  ],
});
gcixProject.addGitIgnore("docs/api/api.*.md");
gcixProject.synth();
