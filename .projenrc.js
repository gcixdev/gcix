const { cdk } = require('projen');

const gcixProject = new cdk.JsiiProject({
  authorEmail: 'daniel@vonessen.eu',
  authorName: 'Daniel von Eßen',
  defaultReleaseBranch: 'main',
  name: 'gcix',
  repositoryUrl: 'https://gitlab.com/dvonessen/gcix.git',
  packageName: 'gcix',
  description: 'GitLab CI multi language Library (x)',
  docgen: true,
  github: false,
  bundledDeps: [
    'js-yaml', // Used to render the pipeline
    '@types/js-yaml',
  ],
});

gcixProject.synth();
