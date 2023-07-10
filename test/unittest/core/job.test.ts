import { Job, Artifacts, Rule, Cache, PagesJob, WhenStatement, PredefinedVariables, Pipeline, JobCollection } from '../../../src';
import { check } from '../../comparison';

let rule: Rule;
let job: Job;

export function checkJobProperties(checkJob: Job) {
  expect(checkJob.name).toBe('job-name-fixture-stage');
  expect(checkJob.stage).toBe('fixture_stage');
  expect(checkJob.image?.name).toBe('busybox');
  expect(checkJob.variables).toEqual({
    ENV_VAR: 'Hello',
    CUSTOM: 'World',
  });
  expect(checkJob.tags).toEqual(['custom', 'docker']);
  // @ts-ignore
  expect(checkJob.rules[0].render()).toEqual({
    allow_failure: false,
    if: 'echo "I am prepended" || true',
    when: 'on_success',
  });
  // @ts-ignore
  expect(checkJob.needs[0].name).toBe('needs-job-needs');
  expect(checkJob.scripts[0]).toBe('date');
  // @ts-ignore
  expect(checkJob.artifacts.paths).toContain('custom/path/to/artifact.txt');
  // @ts-ignore
  expect(checkJob.cache.paths[0]).toBe('./path/to/cache/');
  expect(checkJob.allowFailure).toBe(true);
};

beforeEach(() => {
  rule = new Rule({
    ifStatement: `${PredefinedVariables.CI_COMMIT_REF_NAME} == main`,
    when: WhenStatement.ALWAYS,
    allowFailure: true,
  },
  );

  job = new Job({
    scripts: [
      'date',
      `echo "You are running on branch: ${PredefinedVariables.CI_COMMIT_REF_NAME}"`,
    ],
    stage: 'fixture_stage',
    name: 'job_name',
    image: 'busybox',
    allowFailure: true,
    cache: new Cache({ paths: ['path/to/cache/'] }),
    rules: [new Rule({ ifStatement: 'echo "I am prepended" || true' }), rule],
    artifacts: new Artifacts({ paths: ['custom/path/to/artifact.txt'] }),
    tags: ['custom', 'docker'],
    variables: { ENV_VAR: 'Hello', CUSTOM: 'World' },
    // This add_needs() call will result in an empty list,
    // this is because the Job() object is not added to a pipeline.
    needs: [new Job({ scripts: ['echo I am important'], stage: 'needs', name: 'needs_job' })],
  });
});

test('job render', async () => {
  check(job.render(), expect);
});

test ('job properties', async () => {
  checkJobProperties(job);
});

test('job modification', () => {
  const testJob = new Job({
    scripts: ['date'],
    stage: 'fixture_stage',
    name: 'job_name',
  });
  testJob.appendScripts([`echo "You are running on branch: $$${PredefinedVariables.CI_COMMIT_REF_NAME}"`]);
  testJob.assignImage('busybox');
  testJob.assignAllowFailure(true);
  testJob.assignCache(new Cache({ paths: ['path/to/cache/'] }));
  testJob.appendRules([rule]);
  testJob.prependRules([new Rule({ ifStatement: 'echo "I am prepended" || true' })]);
  testJob.assignArtifacts(new Artifacts({ paths: ['custom/path/to/initialised_path.txt'] }));
  testJob.artifacts?.addPaths(['custom/path/to/artifact.txt']);
  testJob.addTags(['custom', 'docker']);
  testJob.addVariables({ ENV_VAR: 'Hello', CUSTOM: 'World' });
  // This add_needs() call will result in an empty list,
  // this is because the Job() object is not added to a pipeline.
  testJob.addNeeds([new Job({ scripts: [`echo I am needed by ${testJob.name}`], stage: 'needs', name: 'needs_job' })]);
  checkJobProperties(testJob);
});

test('set tags', ()=> {
  job.assignTags(['new', 'world']);
  expect(job.tags).toEqual(['new', 'world']);
});

test('job exceptions', () => {
  expect(() => {
    new Job({ scripts: ['Neither name nor stage'] });
  }).toThrow('At least one of the parameters `name` or `stage` have to be set.');
});

test('pages job', ()=> {
  const pipeline = new Pipeline({});
  pipeline.addChildren({ jobsOrJobCollections: [new PagesJob()] });
  check(pipeline.render(), expect);
});

test('complex dependencies', ()=>{
  const job1 = new Job({ name: 'job1', scripts: ['date'] });
  const job2 = new Job({ name: 'job2', scripts: ['date'] });
  job2.addDependencies([job1]);

  const job3 = new Job({ name: 'job3', scripts: ['date'] });
  const job4 = new Job({ name: 'job4', scripts: ['date'] });
  const collection1 = new JobCollection().addChildren({ jobsOrJobCollections: [job3, job4], stage: 'sequence', name: 'in' });
  const job5 = new Job({ name: 'job5', scripts: ['date'] });
  job5.addDependencies([collection1]);

  const seq2 = new JobCollection().addChildren({ jobsOrJobCollections: [collection1] });
  const seq3 = new JobCollection().addChildren({ jobsOrJobCollections: [seq2, job5], name: 'bar' } );

  const job6 = new Job({ name: 'job6', scripts: ['date'] });
  job6.addDependencies([job1, job2, job3, job4, job5, seq3]);

  const pipeline = new Pipeline();
  pipeline.addChildren({ jobsOrJobCollections: [job1, job2, seq3, job6] });

  check(pipeline.render(), expect);
});
