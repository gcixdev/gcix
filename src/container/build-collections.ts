import {
  DiveScan,
  CranePush,
  TrivyScanLocalImage,
  TrivyIgnoreFileCheck,
  KanikoExecute,
  Registry,
  DockerClientConfig,
} from ".";
import { JobCollection, PredefinedVariables, Cache, CacheKey } from "..";

export interface BuildContainerCollectionProps {
  /**
   * Container registry to push the image to. If the container registry
   * needs authentication, you have to provide a `DockerClientConfig` object
   * with credentials.
   * @default Registry.DOCKER
   */
  readonly registry?: Registry | string;
  /**
   * Image name with stage in the registry. e.g. username/imageName.
   * @default PredefinedVariables.ciProjectName
   */
  readonly imageName?: string;
  /**
   * Image tag. Depending of the build it defaults either to the git tag or
   * to the actual branch name.
   * @default PredefinedVariables.ciCommitTag
   * @default PredefinedVariables.ciCommitRefName
   */
  readonly imageTag?: string;
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
   * Set to `false` to skip the Crane push job.
   * @default true
   */
  readonly doCranePush?: Boolean;
  /**
   * The name of the Bootstrap job.
   */
  readonly jobName?: string;
  /**
   * The stage of the Bootstrap job.
   */
  readonly jobStage?: string;
}
export interface IBuildContainerCollection {
  /**
   * Container registry to push the image to. If the container registry
   * needs authentication, you have to provide a `DockerClientConfig` object
   * with credentials.
   * @default Registry.DOCKER
   */
  registry: Registry | string;
  /**
   * Image name with stage in the registry. e.g. username/imageName.
   * @default PredefinedVariables.ciProjectDir
   */
  imageName: string;
  /**
   * Image tag. Depending of the build it defaults either to the git tag or
   * to the actual branch name.
   * @default PredefinedVariables.ciCommitTag
   * @default PredefinedVariables.ciCommitRefName
   */
  imageTag: string;
  /**
   * Creates the Docker configuration file base on objects settings, to
   * authenticate against given registries.
   * @default DockerClientConfig with login to the official Docker Hub
   * and expecting credentials given as environment variables
   * `REGISTRY_USER` and `REGISTRY_LOGIN`.
   */
  dockerClientConfig: DockerClientConfig;
  /**
   * Kaniko execute job
   */
  kanikoExecuteJob: KanikoExecute;
  /**
   * Dive scan job
   */
  diveScanJob: DiveScan;
  /**
   * Trivy scan local image job
   */
  trivyScanLocalImageJob: TrivyScanLocalImage;
  /**
   * Trivy ignore file check job
   */
  trivyIgnoreFileCheckJob: TrivyIgnoreFileCheck;
  /**
   * Crane push job
   */
  cranePushJob: CranePush;
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
  /**
   * Set to `false` to skip the Crane push job.
   * @default true
   */
  doCranePush: Boolean;
}
/**
 * Creates a `gcip.Sequence` to build, scan and push a container image.
 *
 * The build step is executed by `KanikoExecute`,  it will build the container
 * image an outputs it to a tarball. There are two scan's, optimization scan
 * with `DiveScan` to scan storage wasting in container image and a
 * vulnerability scan with `TrivyScanLocalImage`. Both outputs are uploaded
 * as an artifact to the GitLab instance. The container image is uploaded
 * with `CranePush`.
 */
export class BuildContainerCollection
  extends JobCollection
  implements IBuildContainerCollection
{
  registry: string | Registry;
  imageName: string;
  imageTag: string;
  dockerClientConfig: DockerClientConfig;
  doDiveScan: Boolean;
  doTrivyScan: Boolean;
  doTrivyignoreCheck: Boolean;
  doCranePush: Boolean;
  trivyIgnoreFileCheckJob: TrivyIgnoreFileCheck;
  kanikoExecuteJob: KanikoExecute;
  diveScanJob: DiveScan;
  trivyScanLocalImageJob: TrivyScanLocalImage;
  cranePushJob: CranePush;
  constructor(props: BuildContainerCollectionProps) {
    super();
    this.imageName = props.imageName ?? PredefinedVariables.ciProjectName;
    this.registry = props.registry ?? Registry.DOCKER;
    this.doDiveScan = props.doDiveScan ?? true;
    this.doTrivyScan = props.doTrivyScan ?? true;
    this.doTrivyignoreCheck = props.doTrivyignoreCheck ?? true;
    this.doCranePush = props.doCranePush ?? true;
    this.dockerClientConfig =
      props.dockerClientConfig ?? new DockerClientConfig();

    if (props.imageTag) {
      this.imageTag = props.imageTag;
    } else if (PredefinedVariables.ciCommitTag) {
      this.imageTag = PredefinedVariables.ciCommitTag;
    } else {
      this.imageTag = PredefinedVariables.ciCommitRefSlug;
    }

    this.cache = new Cache({
      paths: ["image"],
      cacheKey: new CacheKey({
        key: `${PredefinedVariables.ciCommitRefSlug}-${this.imageTag}`,
      }),
    });

    /**
     * KanikoExecute
     */
    this.kanikoExecuteJob = new KanikoExecute({
      imageName: this.imageName,
      imageTag: this.imageTag,
      registries: [this.registry],
      tarPath: this.cache.paths[0],
      dockerClientConfig: this.dockerClientConfig,
    });
    this.kanikoExecuteJob.assignCache(this.cache);
    this.addChildren({ jobsOrJobCollections: [this.kanikoExecuteJob] });

    /**
     * DiveScan job
     */
    this.diveScanJob = new DiveScan({
      imageName: this.imageName,
      imagePath: this.cache.paths[0],
    });
    this.diveScanJob.assignCache(this.cache);
    if (this.doDiveScan)
      this.addChildren({ jobsOrJobCollections: [this.diveScanJob] });

    /**
     * TrivyScan job
     */
    this.trivyScanLocalImageJob = new TrivyScanLocalImage({
      imageName: this.imageName,
      imagePath: this.cache.paths[0],
    });
    this.trivyScanLocalImageJob.assignCache(this.cache);
    if (this.doTrivyScan)
      this.addChildren({ jobsOrJobCollections: [this.trivyScanLocalImageJob] });

    /**
     * TrivyIgnoreFileCheck job
     */
    this.trivyIgnoreFileCheckJob = new TrivyIgnoreFileCheck({});
    if (this.doTrivyignoreCheck)
      this.addChildren({
        jobsOrJobCollections: [this.trivyIgnoreFileCheckJob],
      });

    /**
     * CranePush job
     */
    this.cranePushJob = new CranePush({
      dstRegistry: this.registry,
      imageName: this.imageName,
      imageTag: this.imageTag,
      tarPath: this.cache.paths[0],
      dockerClientConfig: this.dockerClientConfig,
    });
    if (this.doCranePush)
      this.addChildren({ jobsOrJobCollections: [this.cranePushJob] });
  }
}

/**
 * BuildGitlabContainerCollection class.
 *
 * Orchestrates a GitLab-specific CI/CD pipeline for building, scanning,
 * and pushing container images. Extends the BuildContainerCollection class.
 * Handles GitLab-specific configurations, such as image name, registry,
 * and Docker client authentication.
 *
 * @class BuildGitlabContainerCollection
 * @extends {BuildContainerCollection}
 */
export class BuildGitlabContainerCollection extends BuildContainerCollection {
  /**
   * Constructor for BuildGitlabContainerCollection.
   * Overrides the parent constructor to handle GitLab-specific configurations.
   * Throws an error if the `CI_REGISTRY` environment variable is not set.
   * Initializes Docker client authentication using CI_REGISTRY_USER and CI_REGISTRY_PASSWORD.
   *
   * @param {BuildContainerCollectionProps} props - Configuration properties for the collection.
   * @throws {Error} Throws an error if CI_REGISTRY environment variable is not set.
   */
  constructor(props: BuildContainerCollectionProps) {
    const _props = { ...props };
    if (!PredefinedVariables.ciRegistry) {
      throw new Error("CI_REGISTRY environment variable not set!");
    }
    _props.imageName = props.imageName ?? PredefinedVariables.ciProjectPath;
    _props.registry = props.registry ?? PredefinedVariables.ciRegistry;
    (_props.dockerClientConfig = new DockerClientConfig().addAuth(
      PredefinedVariables.ciRegistry,
      "CI_REGISTRY_USER",
      "CI_REGISTRY_PASSWORD",
    )),
      super(_props);
  }
}
