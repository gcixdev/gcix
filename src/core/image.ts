import { IBase } from './base';
import { deepcopy } from '../helper';
/**
 * This module represents the Gitlab CI [Image](https://docs.gitlab.com/ee/ci/yaml/#image) keyword.
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

export interface RenderedImage {
  readonly name: string;
  readonly entrypoint?: string[];
}

export interface ImageProps {
  /**
   * @description The fully qualified image name. Could include
   * repository and tag as usual.
   */
  readonly name: string;
  /**
   * @description Container image tag in registrie to use.
   */
  readonly tag?: string;
  /**
   * @description
   * Overwrites the containers entrypoint.
   */
  readonly entrypoint?: string[];
}

export interface IImage {
  /**
     *
     * @param tag
     * @description Returns a copy of that image with altered tag.
      * You can still use the original Image object with its original tag.
     */
  withTag(tag: string): Image;
  /**
     *
     * @param entrypoint
     * @description Returns a copy of that image with altered entrypoint.
     * You can still use the original Image object with its original entrypoint.
     */
  withEntrypoint(entrypoint: string[]): Image;
}

export class Image implements IImage, IBase {
  name: string;
  tag?: string | undefined;
  entrypoint?: string[] | undefined;

  constructor(props: ImageProps) {
    this.name = props.name;
    this.tag = props.tag;
    this.entrypoint = props.entrypoint;
  }

  withTag(tag: string): Image {
    const copy = deepcopy(this);
    copy.tag = tag;
    return copy;
  }

  withEntrypoint(entrypoint: string[]): Image {
    const copy = deepcopy(this);
    copy.entrypoint = entrypoint;
    return copy;
  }

  render(): any {
    const renderedImage: RenderedImage = {
      name: this.name + (this.tag || ''),
      entrypoint: this.entrypoint,
    };
    return renderedImage;
  }

  isEqual(comparable: IBase): comparable is Image {
    return this.render() === comparable.render();
  }
}
