/**
 * Represents the properties for the `pipInstallRequirements` static method.
 */
export interface PipInstallRequirementsProps {
  /**
   * The location and name of the requirements file.
   * @default "requirements.txt"
   */
  readonly requirementsFile?: string;

  /**
   * The version hint of pipenv to install if `Pipfile.lock` is found.
   * For example '==2022.08.15'. Defaults to an empty string, indicating
   * installation of the latest version.
   * @default ""
   */
  readonly pipenvVersionSpecifier?: string;
}

/**
 * Represents a collection of utility functions for scripting tasks.
 */
export class PythonScripts {
  /**
   * Generates a shell command to install project requirements using `pipenv`
   * and `pip` based on the presence of a `Pipfile.lock` or `requirements.txt`.
   *
   * @param props - An object containing the properties for installation.
   * @returns A shell command string for installing project requirements.
   */
  static pipInstallRequirements(props: PipInstallRequirementsProps): string {
    const requirementsFile = props.requirementsFile ?? "requirements.txt";
    const pipenvVersionSpecifier = props.pipenvVersionSpecifier ?? "";

    return `if test -f Pipfile.lock; then
    pip install pipenv${pipenvVersionSpecifier};
    pipenv install --dev --system;
    fi;
    if test -f ${requirementsFile}; then
    pip install --upgrade -r ${requirementsFile};
    fi`.replace(/  +/g, "");
  }
  private constructor() {}
}
