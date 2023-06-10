const { cdk } = require('projen');

const gcixProject = new cdk.JsiiProject({
  authorEmail: 'daniel@vonessen.eu',
  authorName: 'Daniel von Essen',
  copyrightOwner: 'Daniel von Essen',
  defaultReleaseBranch: 'main',
  name: 'gcix',
  repositoryUrl: 'https://gitlab.com/dvonessen/gcix.git',
  packageName: 'gcix',
  description: 'GitLab CI multi language Library (x)',
  docgen: true,
  github: false,
  bundledDeps: [
    'js-yaml',
  ],
  devDeps: [
    '@types/js-yaml',
    '@types/node',
    '@types/jest',
  ],
  docsDirectory: 'public',
});

gcixProject.synth();
