import { IBase } from './base';
/**This module represents the Gitlab CI [Image](https://docs.gitlab.com/ee/ci/yaml/#image) keyword.
 * Use `Image` to specify a Docker image to use for the `gcip.core.job.Job`.
 *
 * Objects of this class are not meant to be altered. This is because Image
 * objects are typically be defined at a central place and often re-used.
 * Altering the object at one place may lead to unpredictable changes at any
 * reference to that object. That is this class has no setter methods.
 * However you can use  the `.with_tag()` and `.with_entrypoint()` methods on
 * an Image object, which will return an altered copy of that image.
 * Thus you can re-use a centrally maintained Image object and modify it for
 * just the place you are using the altered image (copy).
*/

type RenderedImage = {
  [key: string]: string | string[];
};

export interface ImageProps {
  /**
   * @description The fully qualified image name. Could include
   * repository and tag as usual.
   */
  name: string;
  /**
   * @description Container image tag in registrie to use.
   */
  tag?: string;
  /**
   * @description
   * Overwrites the containers entrypoint.
   */
  entrypoint?: string[];
}

export interface IImage {
  /**
     *
     * @param tag
     * @description Returns a copy of that image with altered tag.
      * You can still use the original Image object with its original tag.
     */
  with_tag(tag: string): Image;
  /**
     *
     * @param entrypoint
     * @description Returns a copy of that image with altered entrypoint.
     * You can still use the original Image object with its original entrypoint.
     */
  withEntrypoint(entrypoint: string[]): Image;
}

export class Image implements IBase, IImage, ImageProps {
  name: string;
  tag?: string | undefined;
  entrypoint?: string[] | undefined;

  constructor(props: ImageProps) {
    this.name = props.name;
    this.tag = props.tag;
    this.entrypoint = props.entrypoint;
  }

  with_tag(tag: string): Image {
    const copy = { ...this };
    copy.tag = tag;
    return copy;
  }

  withEntrypoint(entrypoint: string[]): Image {
    const copy = { ...this };
    copy.entrypoint = entrypoint;
    return copy;
  }

  render(): RenderedImage {
    const rendered: RenderedImage = {};
    rendered.name = this.name + (this.tag || '') ;
    if (this.entrypoint) {
      rendered.entrypoint = this.entrypoint;
    }
    return rendered;
  }
  /**
   *
   * @param image Another instance of the `Image` class
   * @description compares the return of the `this.render()` method and
   * the `image.render()` method.
   */
  equals(image: Image): boolean {
    return this.render() === image.render();
  }
}
