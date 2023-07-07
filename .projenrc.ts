import { cdk } from "projen";

const gcixProject = new cdk.JsiiProject({
  author: "Daniel von Essen",
  copyrightOwner: "Daniel von Essen",
  authorAddress: "daniel@vonessen.eu",
  description: 'GitLab CI multi language Library (x)',
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.0.0",
  name: "gcix",
  projenrcTs: true,
  repositoryUrl: "https://gitlab.com/dvonessen/gcix.git",
  docgen: true,
  github: false,
  bundledDeps: [
    "js-yaml"
  ],
  devDeps: [
    'sanitize-filename',
    '@types/js-yaml',
    '@types/node',
    '@types/jest',
  ],
  docsDirectory: "public",
  publishToPypi: {
    distName: "gcix",
    module: "gcix",
  },
  vscode: true,
});
gcixProject.vscode?.settings.addSettings({
  'editor.tabSize': 2,
});

gcixProject.synth();
