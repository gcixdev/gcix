import { IBase } from './base';

/**
 * **ALPHA** This module represents the Gitlab CI
 * [Service](https://docs.gitlab.com/ee/ci/yaml/README.html#services) keyword.
 *
 * The services keyword defines a Docker image that runs during a job linked
 * to the Docker image that the image keyword defines.
 * This allows you to access the service image during build time.
 *
 * Currently this module is an unfinished prototype.
 */
export interface ServiceProps {
  readonly name: string;
};

export interface IService extends IBase {
  readonly name: string;
};

export class Service implements IService {
  readonly name: string;
  constructor(props: ServiceProps) {
    this.name = props.name;
  }
  render(): any {
    return this.name;
  }
  isEqual(comparable: IBase): comparable is IBase {
    return comparable.render() === this.render();
  }
  ;
};
