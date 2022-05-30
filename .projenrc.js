const { cdk } = require('projen');

const project = new cdk.JsiiProject({
  author: 'Daniel von Eßen',
  authorAddress: 'daniel@vonessen.eu',
  defaultReleaseBranch: 'main',
  name: 'gcix',
  repositoryUrl: 'https://gitlab.com/dvonessen/gcix.git',
  packageName: 'gcix', // The "name" in package.json.
  description:
    'GitLab CI multi language Library (x)',
  docgen: true,
  github: false,
  bundledDeps: [
    'js-yaml', // Used to render the pipeline
    '@types/js-yaml',
  ],
});

project.synth();
