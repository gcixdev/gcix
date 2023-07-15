import { cdk } from 'projen';

const gcixProject = new cdk.JsiiProject({
  author: 'Daniel von Essen',
  copyrightOwner: 'Daniel von Essen',
  authorAddress: 'daniel@vonessen.eu',
  description: 'GitLab CI X Library (X stands for multilanguage)',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'gcix',
  projenrcTs: true,
  repositoryUrl: 'https://gitlab.com/gcix/gcix.git',
  docgen: true,
  github: false,
  minNodeVersion: '18.0.0',
  bundledDeps: [
    'js-yaml',
    'lodash',
  ],
  devDeps: [
    'sanitize-filename',
    'ts-node',
    'tmp',
    '@types/tmp',
    '@types/lodash',
    '@types/js-yaml',
    '@types/jest',
  ],
  docsDirectory: 'public',
  publishToPypi: {
    distName: 'gcix',
    module: 'gcix',
  },
  vscode: true,
  jestOptions: {
    jestConfig: {
      setupFiles: [
        './test/set-env-vars.ts',
      ],
    },
  },
  prettier: true,
});
gcixProject.vscode?.settings.addSettings({
  'editor.tabSize': 2,
});

/**
 * Run test and update comparison files.
 */
gcixProject.addScripts({ 'test:update': 'UPDATE_TEST_OUTPUT=true npx projen test' });

gcixProject.synth();
