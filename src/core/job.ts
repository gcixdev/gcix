import { Image } from './image';
import { Rule } from './rule';

const rule = new Rule({

});

export interface JobProps {
  script: string | string[];
  name?: string;
  stage?: string;
  image?: Image | string;
  allow_failure?: boolean | string | number | number[];
  variables?: {[key: string]: string};
  tags?: string[];
  rules?: Rule[];
  dependencies?: Job[] | Sequence[];
  needs?: Need[] | Job[] | Sequence[];
  artifacts?: Artifacts,
  cache?: Cache,
}
export interface IJob {

}
export class Job implements JobProps, IJob {
  artifacts: Opti;onal
  cache: a;ny
  needs: Optiona;l
  Job: any;
  tags: Optional;
  rules: Optional;
  dependencies: Optional;
  variable;s: Optional
  allow_fa;ilure: Optional
  str: any;
  int: any;
  script: string ;| string[]
  name?: any;
  stage: Optional
  image: Optional
  public sayHello() {
    return 'hello, world!';
  }
}
