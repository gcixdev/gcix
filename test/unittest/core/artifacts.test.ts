import { Artifacts, PredefinedVariables, WhenStatement } from '../../../src';
import { check } from '../../comparison';

test('simple', () => {
  check(new Artifacts({ paths: ['test/artifact/one.txt'] }).render(), expect);
});

test('advanced', () => {
  check(new Artifacts({
    paths: ['a/b/c/d', 'foo/bar/baz.txt'],
    excludes: ['*.log'],
    public: false,
    untracked: true,
    exposeAs: 'Artifact 1',
    expireIn: '1 month',
    name: 'Custom Artifact',
    when: WhenStatement.ONSUCCESS,
  }).render(), expect);
});

test('report', ()=> {
  const artifacts = new Artifacts({ reports: [{ reportType: 'coverage_report', file: 'cov.xml' }] } );
  check(artifacts.render(), expect);
});

test('artifacts and report', () => {
  check(new Artifacts({ paths: ['foo/bar/baz'], excludes: ['foo/bar/baz/**'], reports: [{ reportType: 'codequality', file: 'code_quality.xml' }] }).render(), expect);
});

/**
 * https://gitlab.com/dbsystel/gitlab-ci-python-library/-/issues/85
 * `PredefinedVariables.CI_PROJECT_DIR` was not properly shortened to '.'
 * when path only consists of `PredefinedVariables.CI_PROJECT_DIR`.
 */
test('path is ci project dir', () => {
  expect(new Artifacts({ paths: [PredefinedVariables.CI_PROJECT_DIR] }).paths[0]).toBe('.');
});

test('exceptions', () => {
  expect(() => {
    new Artifacts({ paths: ['bar/baz'], when: WhenStatement.DELAYED });
  }).toThrowError(/.* is not allowed. Allowed when statements: always,on_failure,on_success/);
});

test('getter and methods', () => {
  const artifact = new Artifacts({ paths: ['src/artifacts/*', 'file.xml', 'test.json'], excludes: ['src/artifacts/foo', 'src/artifacts/bar', 'file.xml'] });
  artifact.addPaths(['add1.test', 'add2.test']);
  artifact.addExcludes(['added_exclude1', 'added_exclude2']);
  expect(artifact.paths).toEqual(['src/artifacts/*', 'file.xml', 'test.json', 'add1.test', 'add2.test']);
  expect(artifact.excludes).toEqual(['src/artifacts/foo', 'src/artifacts/bar', 'file.xml', 'added_exclude1', 'added_exclude2']);
});

test('empty artifacts', () => {
  const artifact = new Artifacts({});
  expect(artifact.render()).toStrictEqual({});
});

test('equality', () => {
  const artifactToCompareTo = new Artifacts({
    paths: ['a/b/c/d', 'foo/bar/baz.txt'],
    excludes: ['*.log'],
    public: false,
    untracked: true,
    exposeAs: 'Artifact 1',
    expireIn: '1 month',
    name: 'Custom Artifact',
    when: WhenStatement.ONSUCCESS,
  });
  const artifactEqualsToCompareTo = new Artifacts({
    paths: ['a/b/c/d', 'foo/bar/baz.txt'],
    excludes: ['*.log'],
    public: false,
    untracked: true,
    exposeAs: 'Artifact 1',
    expireIn: '1 month',
    name: 'Custom Artifact',
    when: WhenStatement.ONSUCCESS,
  });

  const artifactNotEqualsToCompareTo = new Artifacts({
    paths: ['1/2/3/4', 'foo/bar/baz.txt'],
    excludes: ['*.logs'],
    public: true,
    untracked: false,
    exposeAs: 'Artifact 2',
    expireIn: '1 years',
    name: 'Custom Artifact2',
    when: WhenStatement.ALWAYS,
  });

  expect(artifactToCompareTo.isEqual(artifactEqualsToCompareTo)).toBe(true);
  expect(artifactToCompareTo.isEqual(artifactNotEqualsToCompareTo)).not.toBe(true);
});

test('exception if path starts with /', () => {
  expect(() => {new Artifacts({ paths: ['/root/path/not/allowed.txt'] });}).toThrowError(/Path .* not relative to .*\./);
});
