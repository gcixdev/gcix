export function deepcopy(object: any) {
  return JSON.parse(JSON.stringify(object));
}
