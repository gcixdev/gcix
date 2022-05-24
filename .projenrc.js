const { cdk } = require('projen');

const project = new cdk.JsiiProject({
  author: 'Daniel von Eßen',
  authorAddress: 'daniel@vonessen.eu',
  defaultReleaseBranch: 'main',
  name: 'gcix',
  repositoryUrl: 'https://gitlab.com/dvonessen/gcix.git',
  packageName: 'gcix', /* The "name" in package.json. */
  description: 'GitLab CI multi language Library (x)', /* The description is just a string that helps people understand the purpose of the package. */
  github: false,
});

project.synth();
