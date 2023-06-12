export interface IBase {
  /**
     * Returns a representation of any object which implements `IBase`.
        The rendered representation is used by the gcix to dump it
        in YAML format as part of the .gitlab-ci.yml pipeline.
  */
  render(): any;
}
