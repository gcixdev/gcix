export function deepcopy(object: any) {
  if (object) {
    return JSON.parse(JSON.stringify(object));
  }
  return undefined;
}
