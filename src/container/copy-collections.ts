import {
  CranePull,
  CranePush,
  TrivyScanLocalImage,
  TrivyIgnoreFileCheck,
  DiveScan,
  Registry,
  DockerClientConfig,
} from ".";
import { Cache, CacheKey, JobCollection, PredefinedVariables } from "..";

export interface CopyContainerCollectionProps {
  /**
   * Image name with stage in the registry. e.g. username/image_name.
   */
  readonly imageName: string;
  /**
   * Container image tag to pull from `srcRegistry` and push to `dstRegistry`.
   */
  readonly imageTag: string;
  /**
   * Container registry to pull the image from. If the container registry needs
   * authentication, you have to provide a `DockerClientConfig` object with
   * credentials.
   * @default Registry.DOCKER
   */
  readonly srcRegistry?: Registry | string;
  /**
   * Container registry to push the image to. If the container registry needs
   * authentication, you have to provide a `DockerClientConfig` object with
   * credentials.
   * @default Registry.DOCKER
   */
  readonly dstRegistry?: Registry | string;
  /**
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries.
   * @default DockerClientConfig with login to the official Docker Hub
   * and expecting credentials given as environment variables
   * `REGISTRY_USER` and `REGISTRY_LOGIN`.
   */
  readonly dockerClientConfig?: DockerClientConfig;
  /**
   * Set to `false` to skip the Dive scan job.
   * @default true
   */
  readonly doDiveScan?: Boolean;
  /**
   * Set to `false` to skip the Trivy scan job.
   * @default true
   */
  readonly doTrivyScan?: Boolean;
  /**
   * Set to `false` to skip the existance check of the `.trivyignore` file.
   * @default true
   */
  readonly doTrivyignoreCheck?: Boolean;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;

  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface ICopyContainerCollection {
  /**
   * Container registry to pull the image from. If the container registry needs
   * authentication, you have to provide a `DockerClientConfig` object with
   * credentials.
   * @default Registry.DOCKER
   */
  srcRegistry: Registry | string;
  /**
   * Container registry to push the image to. If the container registry needs
   * authentication, you have to provide a `DockerClientConfig` object with
   * credentials.
   * @default Registry.DOCKER
   */
  dstRegistry: Registry | string;
  /**
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries.
   * @default DockerClientConfig with login to the official Docker Hub
   * and expecting credentials given as environment variables
   * `REGISTRY_USER` and `REGISTRY_LOGIN`.
   */
  dockerClientConfig: DockerClientConfig;
  /**
   * Image name with stage in the registry. e.g. username/image_name.
   */
  imageName: string;
  /**
   * Container image tag to pull from `srcRegistry` and push to `dstRegistry`.
   */
  imageTag: string;
  /**
   * CranPull job
   */
  cranePullJob: CranePull /**
   * CranPush job
   */;
  cranePushJob: CranePush;
  /**
   * Dive scan job
   */
  diveScanJob?: DiveScan;
  /**
   * Trivy scan local image job
   */
  trivyScanLocalImageJob?: TrivyScanLocalImage;
  /**
   * Trivy ignore file check job
   */
  trivyIgnoreFileCheckJob?: TrivyIgnoreFileCheck;
  /**
   * Set to `false` to skip the Dive scan job.
   * @default true
   */
  doDiveScan: Boolean;
  /**
   * Set to `false` to skip the Trivy scan job.
   * @default true
   */
  doTrivyScan: Boolean;
  /**
   * Set to `false` to skip the existance check of the `.trivyignore` file.
   * @default true
   */
  doTrivyignoreCheck: Boolean;
}
/**
 *  Creates a `gcip.Sequence` to pull, scan and push a container image.
 *
 * The pull step is executed by `CranePull`, it will pull the container image
 * and outputs it to a tarball. There are two scan's, optimization scan with
 * `DiveScan` to scan storage wasting in container image and a vulnerability
 * scan with `TrivyScanLocalImage`.  Both outputs are uploaded as an artifact
 * to the GitLab instance. Built container image is uploaded with `CranePush`.
 *
 * NOTE:
 * We decided to use caches instead of artifacts to pass the Docker image tar
 * archive from one job to another. This is because those tar archives could
 * become very large - especially larger then the maximum artifact size limit.
 * This limit can just be adjusted by the admin of the gitlab instance, so
 * your pipeline would never work, your Gitlab provider would not adjust this
 * limit for you. For caches on the other hand you can define storage backends
 * at the base of your Gitlab runners.
 *
 * Furthermore we set the cache key to the pipeline ID. This is because the
 * name and tag of the image does not ensure that the downloaded tar is unique,
 * as the image behind the image tag could be overridden.  So we ensure
 * uniqueness by downloading the image once per pipeline.
 */
export class CopyContainerCollection
  extends JobCollection
  implements ICopyContainerCollection
{
  srcRegistry: string | Registry;
  dstRegistry: string | Registry;
  dockerClientConfig: DockerClientConfig;
  imageName: string;
  imageTag: string;
  doDiveScan: Boolean;
  doTrivyScan: Boolean;
  doTrivyignoreCheck: Boolean;
  diveScanJob?: DiveScan;
  trivyScanLocalImageJob?: TrivyScanLocalImage;
  trivyIgnoreFileCheckJob?: TrivyIgnoreFileCheck;
  cranePullJob: CranePull;
  cranePushJob: CranePush;
  constructor(props: CopyContainerCollectionProps) {
    super(), (this.srcRegistry = props.srcRegistry ?? Registry.DOCKER);
    this.dstRegistry = props.dstRegistry ?? Registry.DOCKER;
    this.imageName = props.imageName;
    this.imageTag = props.imageTag;
    this.doDiveScan = props.doDiveScan ?? true;
    this.doTrivyScan = props.doTrivyScan ?? true;
    this.doTrivyignoreCheck = props.doTrivyignoreCheck ?? true;
    this.dockerClientConfig =
      props.dockerClientConfig ??
      new DockerClientConfig().addAuth(Registry.DOCKER);

    this.cache = new Cache({
      paths: ["image"],
      cacheKey: new CacheKey({
        key: PredefinedVariables.ciPipelineId + this.imageName + this.imageTag,
      }),
    });

    /**
     * CranePull job
     */
    this.cranePullJob = new CranePull({
      srcRegistry: this.srcRegistry,
      dockerClientConfig: this.dockerClientConfig,
      imageName: this.imageName,
      imageTag: this.imageTag,
      tarPath: this.cache.paths[0],
    });
    this.cranePullJob.assignCache(this.cache);
    this.addChildren({ jobsOrJobCollections: [this.cranePullJob] });

    /**
     * DiveScan job
     */
    if (this.doDiveScan) {
      this.diveScanJob = new DiveScan({
        imageName: this.imageName,
        imagePath: this.cache.paths[0],
      });
      this.diveScanJob.assignCache(this.cache);
      this.addNeeds([this.cranePullJob]);
      this.addChildren({ jobsOrJobCollections: [this.diveScanJob] });
    }

    /**
     * TrivyScan job
     */
    if (this.doTrivyScan) {
      this.trivyScanLocalImageJob = new TrivyScanLocalImage({
        imageName: this.imageName,
        imagePath: this.cache.paths[0],
      });
      this.trivyScanLocalImageJob.assignCache(this.cache);
      this.trivyScanLocalImageJob.addNeeds([this.cranePullJob]);
      this.addChildren({ jobsOrJobCollections: [this.trivyScanLocalImageJob] });
    }

    if (this.doTrivyignoreCheck) {
      this.trivyIgnoreFileCheckJob = new TrivyIgnoreFileCheck({});
      this.addChildren({
        jobsOrJobCollections: [this.trivyIgnoreFileCheckJob],
      });
    }

    /**
     * CranePush job
     */
    this.cranePushJob = new CranePush({
      dstRegistry: this.dstRegistry,
      imageName: this.imageName,
      tarPath: this.cache.paths[0],
      dockerClientConfig: this.dockerClientConfig,
    });
    this.cranePushJob.assignCache(this.cache);
    this.cranePushJob.addNeeds([this.cranePullJob]);
    if (this.trivyScanLocalImageJob) {
      this.cranePushJob.addNeeds([this.trivyScanLocalImageJob]);
    }
    if (this.diveScanJob) {
      this.cranePushJob.addNeeds([this.diveScanJob]);
    }
    this.addChildren({ jobsOrJobCollections: [this.cranePushJob] });
  }
}
