const { cdk } = require('projen');
const project = new cdk.JsiiProject({
  author: 'Daniel von Eßen',
  authorAddress: 'daniel@vonessen.eu',
  defaultReleaseBranch: 'main',
  name: 'gcix',
  repositoryUrl: 'https://github.com/daniel/gcix.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();