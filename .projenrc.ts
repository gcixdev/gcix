import { cdk } from "projen";
import { NpmAccess } from "projen/lib/javascript";
import { ReleaseTrigger } from "projen/lib/release";

const gcixProject = new cdk.JsiiProject({
  author: "Daniel von Essen",
  copyrightOwner: "Daniel von Essen",
  authorAddress: "daniel@vonessen.eu",
  description: "GitLab CI X Library (X stands for multilanguage)",
  defaultReleaseBranch: "main",
  prerelease: "pre",
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
gcixProject.synth();
