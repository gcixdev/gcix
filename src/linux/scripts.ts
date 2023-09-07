export interface LinuxInstallPackageProps {
  /**
   * A string listing all the packages to be installed, separated by spaces.
   *
   */
  readonly packages: string[];
  /**
   * Specifies whether the command(s) should be executed with sudo.
   * @default false
   */
  readonly sudo?: boolean;
}

export class LinuxScripts {
  /**
   * Returns a shell command to check and install a Linux package using the available package manager.
   *
   * This function is useful for installing packages within a GitLab job when the system's package manager is uncertain.
   * Currently supported package managers are: apk, apt-get, yum, dnf, and zypper.
   *
   * Keep in mind that this function supports installing only one package name. If different package managers have
   * different names for the same package, this script might fail.
   *
   * Source: https://unix.stackexchange.com/a/571192/139685
   *
   * @returns A shell command to install the specified package(s) using the available package manager.
   */
  static installPackages(props: LinuxInstallPackageProps): string {
    const _packages = props.packages.join(" ");
    const _sudo = props.sudo ? "sudo " : "";

    return `if [ -x "$(command -v apk)" ]; then ${_sudo}apk update && ${_sudo}apk add --yes --no-cache ${_packages};
      elif [ -x "$(command -v apt-get)" ]; then ${_sudo}apt-get update && ${_sudo}apt-get install --yes ${_packages};
      elif [ -x "$(command -v yum)" ]; then ${_sudo}yum install -y ${_packages};
      elif [ -x "$(command -v dnf)" ]; then ${_sudo}dnf install -y ${_packages};
      elif [ -x "$(command -v zypper)" ]; then ${_sudo}zypper install -y ${_packages};
      else echo "FAILED TO INSTALL PACKAGE: Package manager not found. You must manually install: ${_packages}">&2; fi
    `.replace(/  +/g, "");
  }

  private constructor() {}
}
