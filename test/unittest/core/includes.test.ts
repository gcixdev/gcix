import { IncludeFile, IncludeLocal, IncludeRemote, IncludeArtifact, IncludeTemplate } from '../../../src';
import { check } from '../../comparison';

test('include local', () => {
  check(new IncludeLocal({ local: 'gitlab_local.yml' }).render(), expect);
});

test('include file', () => {
  check(new IncludeFile({ file: '/test/file/gitlab.yml', project: 'test/project' }).render(), expect);
});

test('include file with ref', () => {
  check(new IncludeFile({ file: '/test/file/gitlab.yml', project: 'test/project', ref: 'staging' }).render(), expect);
});

test('include remote', () => {
  check(new IncludeRemote({ remote: 'https://test.com/testfile.yml' }).render(), expect);
});

test('include remote exception', () => {
  expect(() => {new IncludeRemote({ remote: 'httq:/www.foobar.com' });}).toThrowError(' is not a valid URL: ');
});

test('include template', () => {
  check(new IncludeTemplate({ template: 'Gitlab-Ci-Template.yml' }).render(), expect);
});

test('include artifact', () => {
  check(new IncludeArtifact({ job: 'generator', artifact: 'pipeline.yml' }).render(), expect);
});
