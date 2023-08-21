/**
 * The Pipeline is the root container for all `gcix.Job`s and
 * `gcix.JobCollection`s
 *
 * ```ts
 * import { Pipeline, Job } from "gcix"
 * const pipeline = new Pipeline()
 * pipeline.addChildren({jobsOrJobCollections: [new Job({name"my-job", script="date"})]})
 * pipeline.writeYaml()  # Here you have to call `writeYaml()`
 * ```
 */

import * as fs from "fs";
import * as yaml from "js-yaml";
import {
  Include,
  Service,
  JobCollection,
  AddChildrenProps,
  OrderedStringSet,
} from ".";

export interface PipelineProps {
  /**
   * You can add global `gcix.Include`s to the pipeline.
   * [Gitlab CI Documentation](https://docs.gitlab.com/ee/ci/yaml/#include):
   * _"Use include to include external YAML files in your CI/CD configuration."_
   *
   * @param include
   */
  readonly includes?: Include[];
}
export interface IPipeline {
  readonly service: Service[];
  readonly includes: Include[];
  /**
   * Add one or more `gcix.Service`s to the pipeline.
   *
   * Gitlab CI Documentation: _"The services keyword defines a Docker image
   * that runs during a job linked to the Docker image that the image keyword
   * defines."_
   * @param services simply use strings to name the services to link to
   * the pipeline. Use objects of the `gcix.Service` class for
   * more complex service configurations.
   * @returns the modified `Pipeline` object.
   */
  addServices(services: Service[]): Pipeline;
  /**
   * Let you add global `gcix.Include`s to the pipeline.
   * [Gitlab CI Documentation](https://docs.gitlab.com/ee/ci/yaml/#include):
   * _"Use include to include external YAML files in your CI/CD configuration."_
   *
   * @param include
   * @returns the modified `Pipeline` object.
   */
  addInclude(include: Include): Pipeline;
  /**
   * Create the Gitlab CI YAML file from this pipeline object.
   * Use that YAML file to trigger a child pipeline.
   *
   * @param filename the file name of the created yaml file.
   * @default generated-config.yml
   */
  writeYaml(filename?: string): void;
}

export class Pipeline extends JobCollection implements IPipeline {
  readonly service: Service[] = [];
  readonly includes: Include[] = [];
  /**
   * A Pipeline is the uppermost container of `gcix.Job`s and `gcix.JobCollection`s.
   *
   * A Pipeline is a `gcix.JobCollection` itself but has the additional method `Pipeline.write_yaml()`.
   * This method is responsible for writing the whole Gitlab CI pipeline to a YAML file which could then feed
   * the dynamic child pipeline.
   */
  constructor(props?: PipelineProps) {
    super();
    if (props?.includes) {
      this.includes = props.includes;
    }
  }
  addInclude(include: Include): Pipeline {
    this.includes.push(include);
    return this;
  }
  addServices(services: Service[]): Pipeline {
    for (const service of services) {
      this.service.push(service);
    }
    return this;
  }
  addChildren(props: AddChildrenProps): JobCollection {
    super.addChildren(props);
    return this;
  }
  render() {
    const stages = new OrderedStringSet();
    const jobCopies = this.populatedJobs;
    const pipeline: any = {};

    if (this.includes.length) {
      pipeline.include = this.includes.map((include) => include.render());
    }
    if (this.service.length) {
      pipeline.services = this.service.map((service) => service.render());
    }

    for (const job of jobCopies) {
      stages.add(job.stage);
    }
    pipeline.stages = stages.values;

    for (const job of jobCopies) {
      if (job.name in pipeline) {
        throw new Error(
          `Two jobs have the same name '${job.name}' when` +
            " rendering the pipeline.\n" +
            "Please fix this by providing a different name and/or stage when " +
            "adding those jobs to their sequences/pipeline.",
        );
      }
      pipeline[job.name] = job.render();
    }
    return pipeline;
  }
  writeYaml(filename: string = "generated-config.yml"): void {
    const yamlContent = yaml.dump(this.render(), {
      sortKeys: false,
      flowLevel: -1,
      noArrayIndent: true,
      noRefs: true,
    });
    fs.writeFileSync(filename, yamlContent, "utf8");
  }
}
