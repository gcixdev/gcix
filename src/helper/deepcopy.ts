import { cloneDeep } from 'lodash';

export function deepcopy(object: any) {
  return cloneDeep(object);
}
