
import { Job, Pipeline, JobCollection, Rule, Cache, Image, Artifacts } from '../../../src';
import { check } from '../../comparison';

test('name population', () => {
  const job = new Job({ name: 'a', stage: 'b', scripts: ['foobar'] });
  const collection1 = new JobCollection().addChildren({ jobsOrJobCollections: [job], name: 'c', stage: 'd' });
  const collection2 = new JobCollection().addChildren({ jobsOrJobCollections: [collection1], name: 'e', stage: 'f' });
  expect(collection2.populatedJobs[0].name).toBe('e-f-c-d-a-b');
});

test('initialize jobs', () => {
  const job = new Job({
    name: 'foo',
    stage: 'bar',
    scripts: ['test'],
    variables: { foo: 'bar' },
    cache: new Cache({ paths: ['./cache/it'] }),
    artifacts: new Artifacts({ paths: ['take/that'] }),
    tags: ['foobar'],
    rules: [new Rule({ ifStatement: 'thatworks' })],
    image: new Image({ name: 'myimage' }),
    allowFailure: true,
  });

  const collection = new JobCollection().addChildren({ jobsOrJobCollections: [job] });
  collection.initializeVariables({ wrong: 'value' });
  collection.initializeArtifacts(new Artifacts({ paths: ['wrong'] }));
  collection.initializeCache(new Cache({ paths: ['wrong'] }));
  collection.initializeRules([new Rule({ ifStatement: 'wrong' })]);
  collection.initializeTags(['wrong']);
  collection.initializeImage('wrong');
  collection.initializeImage(new Image({ name: 'noob' }));
  collection.initializeAllowFailure(false);

  const populatedJob = collection.populatedJobs[0];

  expect(populatedJob.variables).toEqual({ foo: 'bar' });
  expect(populatedJob.artifacts!.paths[0]).toBe('take/that');
  expect(populatedJob.cache!.paths[0]).toBe('./cache/it');
  expect(populatedJob.rules![0].ifStatement).toBe('thatworks');
  expect(populatedJob.tags).toEqual(['foobar']);
  expect(populatedJob.image!.name).toBe('myimage');
  expect(populatedJob.allowFailure).toBe(true);
});

test('initialize job collection', () => {
  const job = new Job({
    name: 'foo',
    stage: 'bar',
    scripts: ['test'],
  });

  const childCollection = new JobCollection().addChildren({ jobsOrJobCollections: [job] });
  childCollection.initializeVariables({ foo: 'bar' });
  childCollection.initializeArtifacts(new Artifacts({ paths: ['take/that'] }));
  childCollection.initializeCache(new Cache({ paths: ['./cache/it'] }));
  childCollection.initializeRules([new Rule({ ifStatement: 'thatworks' })]);
  childCollection.initializeTags(['foobar']);
  childCollection.initializeImage(new Image({ name: 'myimage' }));
  childCollection.initializeAllowFailure(true);

  const collection = new JobCollection().addChildren({ jobsOrJobCollections: [childCollection] });
  collection.initializeVariables({ wrong: 'value' });
  collection.initializeArtifacts(new Artifacts({ paths: ['wrong'] }));
  collection.initializeCache(new Cache({ paths: ['wrong'] }));
  collection.initializeRules([new Rule({ ifStatement: 'wrong' })]);
  collection.initializeTags(['wrong']);
  collection.initializeImage('wrong');
  collection.initializeImage(new Image({ name: 'noob' }));
  collection.initializeAllowFailure(false);

  const populatedJob = collection.populatedJobs[0];

  expect(populatedJob.variables).toEqual({ foo: 'bar' });
  expect(populatedJob.artifacts!.paths[0]).toBe('take/that');
  expect(populatedJob.cache!.paths[0]).toBe('./cache/it');
  expect(populatedJob.rules![0].ifStatement).toBe('thatworks');
  expect(populatedJob.tags).toEqual(['foobar']);
  expect(populatedJob.image!.name).toBe('myimage');
  expect(populatedJob.allowFailure).toBe(true);
});

test('initialize empty arrays', () => {
  const pipeline = new Pipeline();
  const job1 = new Job({ name: 'job1', scripts: ['date'] });

  const collection = new JobCollection().addChildren({
    jobsOrJobCollections: [
      new Job({ name: 'job2', scripts: ['date'] }).addDependencies([job1]).addNeeds([job1]),
      new Job({ name: 'job3', scripts: ['date'] }),
    ],
  });

  pipeline.addChildren({
    jobsOrJobCollections: [
      job1,
      collection,
      new Job({ name: 'job4', scripts: ['date'] }).addDependencies([job1]).addNeeds([job1]),
      new Job({ name: 'job5', scripts: ['date'] }),
    ],
  });

  // TODO: Check why inititalize* is called empty
  pipeline.initializeDependencies([]);
  pipeline.initializeNeeds([]);
  check(pipeline.render(), expect);
});
