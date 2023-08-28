import { Image } from "../";

/**
 * The PredefinedImages collection supplies commonly utilized container
 * image objects within the gcix framework.
 */
export class PredefinedImages {
  /**
   * A predefined Kaniko container image object.
   */
  static readonly KANIKO: Image = new Image({
    name: "gcr.io/kaniko-project/executor",
    tag: "debug",
    entrypoint: [""],
  });

  /**
   * A predefined Crane container image object.
   */
  static readonly CRANE: Image = new Image({
    name: "gcr.io/go-containerregistry/crane",
    tag: "debug",
    entrypoint: [""],
  });

  /**
   * A predefined Dive container image object.
   */
  static readonly DIVE: Image = new Image({
    name: "wagoodman/dive",
    tag: "latest",
    entrypoint: [""],
  });

  /**
   * A predefined GCIP container image object.
   */
  static readonly GCIP: Image = new Image({
    name: "thomass/gcip",
    tag: "latest",
  });

  /**
   * A predefined Trivy container image object.
   */
  static readonly TRIVY: Image = new Image({
    name: "aquasec/trivy",
    tag: "latest",
    entrypoint: [""],
  });

  /**
   * A predefined Busybox container image object.
   */
  static readonly BUSYBOX: Image = new Image({
    name: "busybox",
    tag: "latest",
  });

  /**
   * A predefined Alpine Git container image object.
   * This image is useful for Git operations within containers.
   */
  static readonly ALPINE_GIT: Image = new Image({
    name: "alpine/git",
    tag: "latest",
    entrypoint: [""],
  });

  /**
   * A predefined GCIX container image object.
   */
  static readonly GCIX: Image = new Image({
    name: "gcix/gcix",
    tag: "latest",
    entrypoint: [""],
  });

  /**
   * Private constructor to prevent instantiation.
   */
  private constructor() {}
}
