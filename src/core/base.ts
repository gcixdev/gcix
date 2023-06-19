export interface IBase {
  /**
   * Returns a representation of any object which implements `IBase`.
   * The rendered representation is used by the gcix to dump it
   * in YAML format as part of the .gitlab-ci.yml pipeline.
   */
  render(): any;
  /**
   * isEqual checks if `this` object is equal to given object
   *
   * @param comparable An arbitrary object to compare to.
   * @returns boolean
   */
  isEqual(comparable: IBase): comparable is IBase;
}
