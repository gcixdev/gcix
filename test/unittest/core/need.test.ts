import { Job, Need, Pipeline, JobCollection, PredefinedVariables } from '../../../src';
import { check } from '../../comparison';

let pipeline: Pipeline;
let collection: JobCollection;
let testJob: Job;
let jobFoo: Job;
let jobBar: Job;
beforeEach(() => {
  pipeline = new Pipeline();
  collection = new JobCollection();
  testJob = new Job({ stage: 'testjob', scripts: ['foobar'] });
  jobFoo = new Job({ name: 'foo', scripts: ['foo'] });
  jobBar = new Job({ name: 'bar', scripts: ['bar'] });

});

test('simple need', () => {
  check(new Need({ job: 'testjob' }).render(), expect);
});

test('no artifacts', () => {
  check(new Need({ job: 'testjob', artifacts: false }).render(), expect);
});

test('other project need', () => {
  check(new Need({ job: 'testjob', project: 'foo/bar' }).render(), expect);
});

test('other project ref need', () => {
  check(new Need({ job: 'testjob', project: 'foo/bar', ref: 'test' }).render(), expect);
});

test('job with needs', () => {
  const job = new Job({ stage: 'depending_job', scripts: ['bar'] });
  job.addNeeds([testJob, new Need({ job: 'job1' }), new Need({ job: 'job2', project: 'foo/bar' })]);
  check(pipeline.addChildren({ jobsOrJobCollections: [testJob, job] }).render(), expect);
});

test('collection with needs', () => {
  pipeline.addChildren({ jobsOrJobCollections: [testJob] }).addChildren({ jobsOrJobCollections: [collection] });
  collection.addChildren({ jobsOrJobCollections: [new Job({ stage: 'firstjob', scripts: ['foo'] }), new Job({ stage: 'secondjob', scripts: ['bar'] })] });
  collection.addNeeds([testJob, new Need({ job: 'job1' }), new Need({ job: 'job2' })]);
  check(pipeline.render(), expect);
});

test('collection with parallel jobs and needs', () => {
  pipeline.addChildren({ jobsOrJobCollections: [testJob] }).addChildren({ jobsOrJobCollections: [collection] });
  collection.addChildren({
    jobsOrJobCollections: [
      new Job({ stage: 'job', name: 'first', scripts: ['foo'] }),
      new Job({ stage: 'secondjob', scripts: ['bar'] }),
      new Job({ stage: 'job', name: 'third', scripts: ['baz'] }),
      new Job({ stage: 'fourthjob', scripts: ['maz'] }),
    ],
  });
  collection.addNeeds([testJob]);
  check(pipeline.render(), expect);
});

test('add collection as need', () => {
  collection.addChildren({
    jobsOrJobCollections: [
      new Job({ stage: 'first', name: 'A', scripts: ['firstDateA'] }),
      new Job({ stage: 'second', name: 'A', scripts: ['secondDateA'] }),
      new Job({ stage: 'last', name: 'A', scripts: ['lastDateA'] }),
      new Job({ stage: 'second', name: 'B', scripts: ['secondDateB'] }),
      new Job({ stage: 'last', name: 'B', scripts: ['lastDateB'] }),
      new Job({ stage: 'first', name: 'B', scripts: ['firstDateB'] }),
    ],
  },
  );

  testJob.addNeeds([collection]);

  pipeline.addChildren({ jobsOrJobCollections: [testJob] });
  check(pipeline.render(), expect);
});

test('needs will be staged', () => {
  const job1 = new Job({ stage: 'first', scripts: ['foobar'] });
  collection = new JobCollection().addChildren({ jobsOrJobCollections: [new Job({ stage: 'second', scripts: ['foobar'] })], stage: 'SSS' });

  const targetJob = new Job({ stage: 'target1', scripts: ['foobar'] }).addNeeds([job1, collection]);
  const targetCollection = new JobCollection().addChildren({ jobsOrJobCollections: [new Job({ stage: 'target2', scripts: ['foobar'] })], stage: 'TTT' }).addNeeds([job1, collection]);

  const collectionWithoutStage = new JobCollection();
  collectionWithoutStage.addChildren({ jobsOrJobCollections: [job1] });
  collectionWithoutStage.addChildren({ jobsOrJobCollections: [collection] });

  const parentCollection = new JobCollection().addChildren({ jobsOrJobCollections: [collectionWithoutStage], stage: 'abc' });

  const parentCollection2 = new JobCollection();
  parentCollection2.addChildren({ jobsOrJobCollections: [targetJob], stage: 'xyz' });
  parentCollection2.addChildren({ jobsOrJobCollections: [targetCollection], stage: 'xyz' });

  const parentParentCollection = new JobCollection().addChildren({ jobsOrJobCollections: [parentCollection], stage: '123' });

  pipeline.addChildren({ jobsOrJobCollections: [parentParentCollection, parentCollection2], stage: 'final' });
  check(pipeline.render(), expect);
});

test('needs collection with stage only', () => {
  /**
   * In a former version of gcip, adding jobs to a collection with providing `stage`
   * leads to a need reference name with a `-` at the end:
   *
   * ```
   * job2-stage-job-seq1:
   *   needs:
   *   - job: job1-stage-job-seq1-
   * ```
   **/
  const job1 = new Job({ scripts: ['echo "I\'m job1"'], name: 'job', stage: 'job1_stage' });
  const job2 = new Job({ scripts: ['echo "I\'m job2"'], name: 'job', stage: 'job2_stage' });
  job2.addNeeds([job1]);

  collection = new JobCollection();
  collection.addChildren({ jobsOrJobCollections: [job1, job2], stage: 'seq1' });
  pipeline.addChildren({ jobsOrJobCollections: [collection] });
  check(pipeline.render(), expect);
});

test('need pipeline', () => {
  jobFoo.addNeeds([new Need({ job: 'test', pipeline: '567890' })]);
  jobBar.addNeeds([new Need({ pipeline: 'other/project' })]);
  pipeline.addChildren({ jobsOrJobCollections: [jobFoo, jobBar] });
  check(pipeline.render(), expect);
});

test('no job and pipeline set', () => {
  expect(() => {
    return new Need({ project: 'foobar' });
  }).toThrowError('At least one of `job` or `pipeline` must be set.');
});
test('project and pipeline raises error', () => {
  expect(() => {
    return new Need({ job: 'test', project: 'foo', pipeline: 'bar' });
  }).toThrowError('Needs accepts either');
});
test('fail on pipeline is ci project id', () => {
  expect(() => {
    return new Need({ job: 'test', pipeline: PredefinedVariables.CI_PIPELINE_ID });
  }).toThrowError(/The pipeline attribute does not accept the current/);
});

test('need name generation', () => {

  // First collection with normal jobs
  // Job2 depends on Job1
  const collection1 = new JobCollection();
  const job1 = new Job({ scripts: ['date'], name: 'job1name', stage: 'job1stage' });
  const job2 = new Job({ scripts: ['date'], name: 'job2name', stage: 'job2stage' });
  collection1.addChildren({ jobsOrJobCollections: [job1, job2.addNeeds([job1])], name: 'seq1name', stage: 'seq1stage' });

  // Second collection
  // This collection gets collection1 with a custom name
  const collection2 = new JobCollection();
  collection2.addChildren({ jobsOrJobCollections: [collection1], name: 'seq2name', stage: 'seq2stage' });
  pipeline.addChildren({ jobsOrJobCollections: [collection2], name: 'pipename', stage: 'pipestage' });

  const renderedPipeline = pipeline.render();
  expect(renderedPipeline['pipename-pipestage-seq2name-seq2stage-seq1name-seq1stage-job2name-job2stage'].needs[0].job).toBe('pipename-pipestage-seq2name-seq2stage-seq1name-seq1stage-job1name-job1stage');
});

test('empty_needs', () => {
  pipeline.addChildren({ jobsOrJobCollections: [new Job({ scripts: ['date'], name: 'job1name', stage: 'job1stage' }).assignNeeds([])] });
  check(pipeline.render(), expect);
});
