import { IBase } from "./base";
import { deepcopy } from "./helper";
/**
 * This module represents the Gitlab CI [Image](https://docs.gitlab.com/ee/ci/yaml/#image) keyword.
 * Use `Image` to specify a Docker image to use for the `gcix.Job`.
 *
 * Instances of this class are intended to be immutable. Image objects are
 * typically defined in a central location and often reused throughout the
 * codebase. Modifying an Image object at one place may result in unexpected
 * changes at any other reference to that object. Therefore, this class does
 * not provide any setter methods to modify its properties directly.
 *
 * However, you can create an altered copy of an Image object using
 * the .withTag() and .withEntrypoint() methods. These methods return a new
 * Image object with the specified modifications, allowing you to reuse the
 * original Image object while making specific changes for a particular use case.
 *
 * By following this approach, you can maintain a central repository of Image
 * objects and easily create customized versions as needed, without affecting
 * the original object or introducing unintended side effects.
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
      name: this.name + (this.tag || ""),
      entrypoint: this.entrypoint,
    };
    return renderedImage;
  }

  isEqual(comparable: IBase): comparable is Image {
    return (
      JSON.stringify(this.render()) === JSON.stringify(comparable.render())
    );
  }
}
