const fs = require('fs');
const path = require('path');
const { cdk } = require('projen');

const docPath = './documentation';
if (fs.existsSync(docPath) == false) {
  fs.mkdirSync(docPath, { recursive: false, mode: 0o750 });
}

const project = new cdk.JsiiProject({
  author: 'Daniel von Eßen',
  authorAddress: 'daniel@vonessen.eu',
  defaultReleaseBranch: 'main',
  name: 'gcix',
  repositoryUrl: 'https://gitlab.com/dvonessen/gcix.git',
  packageName: 'gcix', /* The "name" in package.json. */
  description: 'GitLab CI multi language Library (x)', /* The description is just a string that helps people understand the purpose of the package. */
  docgen: true,
  docgenFilePath: path.join(docPath, 'API.md'),
  github: false,
});

project.synth();
