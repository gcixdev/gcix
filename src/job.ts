import { Image } from './image'

export interface JobProps {
  script: string | string[],
  name?: string,
  stage?: string,
  image?: Image | string,
  allow_failure?: boolean | string | number | number[],
  variables?: {[key: string]: string},
  tags?: string[],
  rules?: Rule[],
  dependencies: Optional[List[Union[Job, Sequence]]] = None,
  needs: Optional[List[Union[Need, Job, Sequence]]] = None,
  artifacts: Optional[Artifacts] = None,
  cache: Optional[Cache] = None,
}
export interface IJob {

}
export class Job implements JobProps, IJob {
  tags: Optional
  rules: Optional
  dependencies: Optional
  variables: Optional
  allow_failure: Optional
  str: any
  int: any
  script: string | string[]
  name?: any
  stage: Optional
  image: Optional
  public sayHello() {
    return 'hello, world!';
  }
}
