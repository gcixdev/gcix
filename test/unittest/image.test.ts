import { Image } from '../../src/core/image';

describe('image', () => {
  test('image class only with image', () => {
    const image = new Image({
      name: 'alpine:3',
    });
    expect(image.name).toBe('alpine:3');
    expect(image.entrypoint).toBe(undefined);
    console.log(image.render());
    expect(image.render()).toMatchObject({
      name: 'alpine:3',

    });
  });
  test('image class with entrypoint', () => {
    const image = new Image({
      name: 'alpine:3', entrypoint: ['/bin/sh', '-c', 'cat', '/etc/os-release'],
    });
    expect(image.name).toBe('alpine:3');
    expect(image.entrypoint).toMatchObject(['/bin/sh', '-c', 'cat', '/etc/os-release']);
    expect(image.render()).toMatchObject({ name: 'alpine:3', entrypoint: ['/bin/sh', '-c', 'cat', '/etc/os-release'] });
  });
});

/**
 * @ToDo
 * Missing PredefinedImages class
 */
// def test_image_with_tag():
//     assert PredefinedImages.GCIP.with_tag("otherThanLatest").tag == "otherThanLatest"
//     assert PredefinedImages.GCIP.tag == "latest"


// def test_image_with_entrypoint():
//     assert PredefinedImages.GCIP.with_entrypoint("foo", "bar").entrypoint == ["foo", "bar"]
//     assert PredefinedImages.GCIP.entrypoint is None
