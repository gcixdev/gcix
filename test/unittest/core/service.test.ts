import { Pipeline, Service } from '../../../src';
import { check } from '../../comparison';

let pipeline: Pipeline;
beforeEach(() => {
  pipeline = new Pipeline();
});

test('simple', () => {
  const service = new Service({ name: 'my-service-name' });
  pipeline.addServices([service]);
  check(pipeline.render(), expect);
});

test('equality', () => {
  const serviceToCompareTo = new Service({ name: 'compare' });
  const serviceEqualToCompareTo = new Service({ name: 'compare' });
  const serviceNotEqualToCompareTo = new Service({ name: 'notEqual' });

  expect(serviceToCompareTo.isEqual(serviceEqualToCompareTo)).toBe(true);
  expect(serviceToCompareTo.isEqual(serviceNotEqualToCompareTo)).not.toBe(true);
});
